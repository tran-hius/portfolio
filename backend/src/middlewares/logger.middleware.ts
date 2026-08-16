import type { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger.util.js";
import { MonitoringService } from "../services/monitoring.service.js";

const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const first = forwarded.split(",")[0];
    if (first) return first.trim();
  }
  return req.ip || req.socket.remoteAddress || "127.0.0.1";
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    // Ignore internal SSE heartbeat or health poll from verbose spam if needed, or log everything cleanly
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    const ip = getClientIp(req);
    const url = req.originalUrl || req.url;

    // Record metrics
    MonitoringService.recordRequest(res.statusCode, durationMs);

    // Skip logging continuous SSE ping comments to keep terminal clean
    if (url.startsWith("/api/v1/analytics/realtime") && res.statusCode === 200) {
      return;
    }

    Logger.http(req.method, url, res.statusCode, durationMs, ip);
  });

  next();
};
