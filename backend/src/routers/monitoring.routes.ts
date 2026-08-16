import express from "express";
import { MonitoringController } from "../controllers/monitoring.controller.js";

const router = express.Router();

// System Health & Monitoring Metrics
router.get("/", MonitoringController.getHealth);
router.get("/health", MonitoringController.getHealth);
router.get("/metrics", MonitoringController.getMetrics);

export default router;
