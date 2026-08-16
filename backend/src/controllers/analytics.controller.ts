import type { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service.js";

const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const first = forwarded.split(",")[0];
    if (first) return first.trim();
  }
  return req.ip || req.socket.remoteAddress || "127.0.0.1";
};

export const AnalyticsController = {
  /**
   * SSE Endpoint: Stream active realtime visitor count to clients
   */
  realtimeStream(req: Request, res: Response) {
    // Standard Server-Sent Events headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();

    const clientIp = getClientIp(req);

    // Log the visit asynchronously
    const userAgent = req.headers["user-agent"] || "Unknown";
    const rawReferer = req.headers.referer || req.headers.referrer;
    const referer =
      typeof rawReferer === "string" ? rawReferer : undefined;

    AnalyticsService.logVisit({
      ip: clientIp,
      userAgent,
      path: (req.query.path as string) || "/",
      method: "GET",
      referer,
    });

    // Register active SSE client
    AnalyticsService.addClient(res, clientIp);

    // Keep connection alive with periodic comment pings every 25 seconds
    const pingInterval = setInterval(() => {
      try {
        res.write(": ping\n\n");
      } catch {
        clearInterval(pingInterval);
      }
    }, 25000);

    req.on("close", () => {
      clearInterval(pingInterval);
      AnalyticsService.removeClient(res);
    });
  },

  /**
   * Public stats endpoint: Get aggregated statistics
   */
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AnalyticsService.getStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Protected admin endpoint: Get paginated visitor logs
   */
  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const searchIp =
        typeof req.query.searchIp === "string"
          ? req.query.searchIp
          : undefined;

      const result = await AnalyticsService.getLogs({
        page,
        limit,
        searchIp,
      });

      return res.status(200).json({
        success: true,
        count: result.logs.length,
        pagination: result.pagination,
        data: result.logs,
      });
    } catch (error) {
      next(error);
    }
  },
};
