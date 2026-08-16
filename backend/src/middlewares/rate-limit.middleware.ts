import type { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    max,
    message = "Too many requests from this IP, please try again later",
  } = options;

  const hits = new Map<string, ClientRecord>();

  // Periodically clean up expired entries every 5 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  // Unref interval so it does not block Node process exit
  if (typeof cleanupInterval.unref === "function") {
    cleanupInterval.unref();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      "unknown-ip";

    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now > record.resetTime) {
      hits.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds.toString());

      return res.status(429).json({
        success: false,
        statusCode: 429,
        errorCode: "TOO_MANY_REQUESTS",
        message,
        retryAfter: retryAfterSeconds,
      });
    }

    next();
  };
};

/**
 * Pre-configured rate limiter for authentication routes:
 * Allows 15 requests per 15-minute window per IP.
 */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many authentication attempts. Please try again after 15 minutes.",
});
