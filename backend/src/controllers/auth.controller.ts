import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";
import { BadRequestError } from "../errors/app.error.js";

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_BASE_OPTIONS = {
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/",
};


const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_BASE_OPTIONS,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    ...COOKIE_BASE_OPTIONS,
    httpOnly: false,
    maxAge: 1 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    ...COOKIE_BASE_OPTIONS,
    httpOnly: true,
    path: "/",
  });
  res.clearCookie("accessToken", {
    ...COOKIE_BASE_OPTIONS,
    httpOnly: false,
    path: "/",
  });
};

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        throw new BadRequestError("Email and password are required");
      }

      const result = await AuthService.login({ email: email.trim().toLowerCase(), password });

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Login successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken || typeof refreshToken !== "string") {
        throw new BadRequestError("Refresh token is required");
      }

      const result = await AuthService.refreshToken(refreshToken);

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      const userId = req.user?.userId;

      await AuthService.logout(refreshToken, userId);
      clearAuthCookies(res);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getMe(req.user!.userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { firstName, lastName, email, password, currentPassword } = req.body;

      const user = await AuthService.updateProfile(userId, {
        firstName,
        lastName,
        email,
        password,
        currentPassword,
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};

