import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../errors/app.error.js";
import { envConfig } from "../config/env.config.js";

export const authorize = (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw new UnauthorizedError("Bạn chưa đăng nhập");
    }

    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    const decoded = jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    if (decoded.role?.toLowerCase() !== "admin") {
      throw new ForbiddenError("Bạn không có quyền truy cập");
    }

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Access Token đã hết hạn"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError("Access Token không hợp lệ"));
    }

    next(error);
  }
};
