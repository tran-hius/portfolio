import express from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getById);

// Protected routes (Admin only)
router.post("/", authorize, ProjectController.create);
router.put("/:id", authorize, ProjectController.update);
router.delete("/:id", authorize, ProjectController.delete);

export default router;
