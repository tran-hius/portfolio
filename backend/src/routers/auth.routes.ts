import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.post("/login", authLimiter, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", authorize, AuthController.getMe);
router.put("/profile", authorize, AuthController.updateProfile);

export default router;