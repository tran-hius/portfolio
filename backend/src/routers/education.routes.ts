import express from "express";
import { EducationController } from "../controllers/education.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", EducationController.getAll);
router.get("/:id", EducationController.getById);

// Protected routes (Admin only)
router.post("/", authorize, EducationController.create);
router.put("/:id", authorize, EducationController.update);
router.delete("/:id", authorize, EducationController.delete);

export default router;
