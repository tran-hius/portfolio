import express from "express";
import { CertificateController } from "../controllers/certificate.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", CertificateController.getAll);
router.get("/:id", CertificateController.getById);

// Protected routes (Admin only)
router.post("/", authorize, CertificateController.create);
router.put("/:id", authorize, CertificateController.update);
router.delete("/:id", authorize, CertificateController.delete);

export default router;
