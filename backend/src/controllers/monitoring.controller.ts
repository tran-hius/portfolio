import type { Request, Response, NextFunction } from "express";
import { MonitoringService } from "../services/monitoring.service.js";

export const MonitoringController = {
  /**
   * Health check endpoint: returns operational status and database latency
   */
  async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = await MonitoringService.getHealth();
      const statusCode = health.status === "HEALTHY" ? 200 : 503;

      return res.status(statusCode).json({
        success: health.status === "HEALTHY",
        data: health,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Detailed system metrics endpoint: memory, uptime, request throughput, error rate
   */
  async getMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await MonitoringService.getMetrics();

      return res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  },
};
