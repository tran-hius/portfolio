import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";
import { BadRequestError } from "../errors/app.error.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        throw new BadRequestError("Email and password are required");
      }

      if (!EMAIL_REGEX.test(email.trim())) {
        throw new BadRequestError("Invalid email format");
      }

      if (password.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters long");
      }

      const result = await AuthService.create({ email: email.trim().toLowerCase(), password });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        throw new BadRequestError("Email and password are required");
      }

      const result = await AuthService.login({ email: email.trim().toLowerCase(), password });

      return res.status(200).json({
        success: true,
        message: "Login successfully",
        data: result,
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
};

