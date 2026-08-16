import express from "express";
import { CertificateController } from "../controllers/certificate.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", CertificateController.getAll);
router.get("/:id", CertificateController.getById);

router.post("/", authorize, CertificateController.create);
router.put("/:id", authorize, CertificateController.update);
router.delete("/:id", authorize, CertificateController.delete);

export default router;
