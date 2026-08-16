import express from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Realtime SSE Stream & Summary Stats
router.get("/realtime", AnalyticsController.realtimeStream);
router.get("/stats", AnalyticsController.getStats);

// Protected Admin Visitor Logs
router.get("/logs", authorize, AnalyticsController.getLogs);

export default router;
