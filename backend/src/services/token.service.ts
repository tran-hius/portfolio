import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

const ACCESS_EXPIRED = "1h";
const REFRESH_EXPIRED = "7d";
const REFRESH_EXPIRED_MS = 7 * 24 * 60 * 60 * 1000;

export const TokenService = {
  generateTokens(payload: { userId: string; email: string; role: string }) {
    const accessToken = jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRED,
    });
    const refreshToken = jwt.sign(
      { userId: payload.userId },
      envConfig.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRED },
    );
    const refreshExpiresAt = new Date(Date.now() + REFRESH_EXPIRED_MS);

    return {
      accessToken,
      refreshToken,
      refreshExpiresAt,
    };
  },

  generateToken(payload: { userId: string; email: string; role: string }) {
    return this.generateTokens(payload);
  },

  verifyAccessToken(token: string) {
    return jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
  },

  verifyRefreshToken(token: string) {
    return jwt.verify(token, envConfig.JWT_REFRESH_SECRET) as {
      userId: string;
    };
  },

  decodeToken(token: string) {
    return jwt.decode(token) as { userId?: string; email?: string; role?: string } | null;
  },
};
