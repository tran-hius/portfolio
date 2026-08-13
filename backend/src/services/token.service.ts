import jwt from "jsonwebtoken";

const ACCESS_EXPIRED = "3m";
const REFRESH_EXPIRED = "3m";

export const TokenService = {
  generateToken(payload: { userId: string; email: string, role: string }) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: ACCESS_EXPIRED,
    });
    const refreshToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: REFRESH_EXPIRED },
    );
    return {
      accessToken,
      refreshToken,
    };
  },

  verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
  },

  verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  },
};
