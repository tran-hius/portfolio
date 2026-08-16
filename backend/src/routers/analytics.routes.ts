import express from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/realtime", AnalyticsController.realtimeStream);
router.get("/stats", AnalyticsController.getStats);
router.get("/logs", authorize, AnalyticsController.getLogs);
router.get("/visitors", authorize, AnalyticsController.getLogs);

export default router;
