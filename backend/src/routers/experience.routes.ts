import express from "express";
import { ExperienceController } from "../controllers/experience.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", ExperienceController.getAll);
router.get("/:id", ExperienceController.getById);

// Protected routes (Admin only)
router.post("/", authorize, ExperienceController.create);
router.put("/:id", authorize, ExperienceController.update);
router.delete("/:id", authorize, ExperienceController.delete);

export default router;
