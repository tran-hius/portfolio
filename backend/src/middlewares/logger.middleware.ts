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
    
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    const ip = getClientIp(req);
    const url = req.originalUrl || req.url;

    MonitoringService.recordRequest(res.statusCode, durationMs);

    if (url.startsWith("/api/v1/analytics/realtime") && res.statusCode === 200) {
      return;
    }

    Logger.http(req.method, url, res.statusCode, durationMs, ip);
  });

  next();
};
