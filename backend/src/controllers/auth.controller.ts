import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.create({ email, password });
      res.status(201).json({ message: "Created successfully", result });
    } catch (error) {
      console.log(error);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json({ message: "Login successfully", result });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        console.error("Stack:", error.stack);
      } else {
        console.error("Login error:", error);
      }

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      const user = await UserService.getMe(req.user!.userId);
      res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
