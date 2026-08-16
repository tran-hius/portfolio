import { TokenService } from "./token.service.js";
import { UserService } from "./user.service.js";
import { HashUtil } from "../utils/hash.util.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { userRepository } from "../repositories/user.repository.js";
import tokenRepository from "../repositories/token.repository.js";
import type { LoginDTO } from "../dtos/login-dto.js";
import type { LoginResponseDTO } from "../dtos/login-response-dto.js";
import { UnauthorizedError } from "../errors/app.error.js";
import { Logger } from "../utils/logger.util.js";

export const AuthService = {
  async seedInitialAdmin(): Promise<void> {
    try {
      const count = await userRepository.count({});
      if (count === 0) {
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const rawPassword = process.env.ADMIN_PASSWORD;

        if (!email || !rawPassword) {
          Logger.warn(
            "[SECURITY] ADMIN_EMAIL or ADMIN_PASSWORD not configured in environment variables. Admin auto-seeding skipped.",
          );
          return;
        }

        const hashedPassword = await HashUtil.hash(rawPassword);

        await userRepository.create({
          firstName: "Tran",
          lastName: "Hieu",
          email,
          password: hashedPassword,
          role: "admin",
        });

        Logger.info(`[SECURITY] Master admin account initialized (${email})`);
      }
    } catch (err) {
      Logger.error("Failed to seed initial admin account:", err);
    }
  },


  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    const { email, password } = data;

    const user = await UserService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await HashUtil.compare(password, String(user.password));

    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const { accessToken, refreshToken, refreshExpiresAt } = TokenService.generateTokens({
      userId: user._id.toString(),
      email: String(user.email),
      role: String(user.role || "admin"),
    });

    await tokenRepository.create({
      userId: user._id.toString(),
      token: refreshToken,
      expiresAt: refreshExpiresAt,
    });

    return {
      user: UserMapper.toResponse(user),
      accessToken,
      refreshToken,
    };
  },

  async refreshToken(oldRefreshToken: string): Promise<LoginResponseDTO> {
    if (!oldRefreshToken) {
      throw new UnauthorizedError("Refresh token is required");
    }

    let decoded: { userId: string } | null = null;
    try {
      decoded = TokenService.verifyRefreshToken(oldRefreshToken);
    } catch {
      await tokenRepository.deleteByToken(oldRefreshToken).catch(() => {});
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const storedToken = await tokenRepository.findByToken(oldRefreshToken);

    if (!storedToken) {
      if (decoded?.userId) {
        await tokenRepository.deleteByUserId(decoded.userId).catch(() => {});
      }
      throw new UnauthorizedError("Refresh token reuse detected. Please sign in again.");
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      await tokenRepository.deleteById(storedToken._id.toString());
      throw new UnauthorizedError("Refresh token has expired. Please sign in again.");
    }

    const user = await userRepository.findById(storedToken.userId.toString());
    if (!user) {
      await tokenRepository.deleteById(storedToken._id.toString());
      throw new UnauthorizedError("User associated with token not found");
    }

    await tokenRepository.deleteById(storedToken._id.toString());

    const { accessToken, refreshToken: newRefreshToken, refreshExpiresAt } = TokenService.generateTokens({
      userId: user._id.toString(),
      email: String(user.email),
      role: String(user.role || "admin"),
    });

    await tokenRepository.create({
      userId: user._id.toString(),
      token: newRefreshToken,
      expiresAt: refreshExpiresAt,
    });

    return {
      user: UserMapper.toResponse(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(refreshToken?: string, userId?: string): Promise<void> {
    if (refreshToken) {
      await tokenRepository.deleteByToken(refreshToken).catch(() => {});
    }
    if (userId) {
      await tokenRepository.deleteByUserId(userId).catch(() => {});
    }
  },

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      currentPassword?: string;
    },
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const updatePayload: Record<string, any> = {};

    if (data.firstName !== undefined) {
      updatePayload.firstName = String(data.firstName).trim();
    }
    if (data.lastName !== undefined) {
      updatePayload.lastName = String(data.lastName).trim();
    }

    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();
      if (!email) {
        throw new Error("Email cannot be empty");
      }
      if (email !== user.email) {
        const existing = await UserService.findByEmail(email);
        if (existing && existing._id.toString() !== userId) {
          throw new Error("Email is already in use by another account");
        }
        updatePayload.email = email;
      }
    }

    if (data.password) {
      if (data.password.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }
      if (data.currentPassword) {
        const isMatch = await HashUtil.compare(
          data.currentPassword,
          String(user.password),
        );
        if (!isMatch) {
          throw new Error("Current password does not match");
        }
      }
      updatePayload.password = await HashUtil.hash(data.password);
    }

    const updated = await userRepository.updateById(userId, updatePayload);
    return UserMapper.toResponse(updated);
  },
};

