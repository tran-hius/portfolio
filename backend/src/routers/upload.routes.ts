import express from "express";
import { UploadController } from "../controllers/upload.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected Upload Endpoints (Admin only)
router.post("/", authorize, UploadController.upload);
router.delete("/", authorize, UploadController.delete);

export default router;
