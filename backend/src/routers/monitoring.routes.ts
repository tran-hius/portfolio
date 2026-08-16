import express from "express";
import { MonitoringController } from "../controllers/monitoring.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", MonitoringController.getHealth);
router.get("/health", MonitoringController.getHealth);
router.get("/metrics", authorize, MonitoringController.getMetrics);

export default router;
