import express from "express";
import { UploadController } from "../controllers/upload.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authorize, UploadController.upload);
router.delete("/", authorize, UploadController.delete);

export default router;
