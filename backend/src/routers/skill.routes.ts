import express from "express";
import { SkillController } from "../controllers/skill.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", SkillController.getAll);
router.get("/:id", SkillController.getById);

// Protected routes (Admin only)
router.post("/", authorize, SkillController.create);
router.put("/:id", authorize, SkillController.update);
router.delete("/:id", authorize, SkillController.delete);

export default router;
