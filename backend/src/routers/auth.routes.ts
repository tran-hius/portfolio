import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.get("/me", authorize, AuthController.getMe);

export default router;