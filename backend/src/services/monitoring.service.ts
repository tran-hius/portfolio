import mongoose from "mongoose";

interface RequestMetrics {
  totalRequests: number;
  status2xx: number;
  status3xx: number;
  status4xx: number;
  status5xx: number;
  totalDurationMs: number;
}

const metrics: RequestMetrics = {
  totalRequests: 0,
  status2xx: 0,
  status3xx: 0,
  status4xx: 0,
  status5xx: 0,
  totalDurationMs: 0,
};

const serverStartTime = new Date();

export const MonitoringService = {
  /**
   * Record a completed HTTP request for metric calculations
   */
  recordRequest(statusCode: number, durationMs: number): void {
    metrics.totalRequests += 1;
    metrics.totalDurationMs += durationMs;

    if (statusCode >= 200 && statusCode < 300) {
      metrics.status2xx += 1;
    } else if (statusCode >= 300 && statusCode < 400) {
      metrics.status3xx += 1;
    } else if (statusCode >= 400 && statusCode < 500) {
      metrics.status4xx += 1;
    } else if (statusCode >= 500) {
      metrics.status5xx += 1;
    }
  },

  /**
   * Perform health check including database ping
   */
  async getHealth() {
    const isDbConnected = mongoose.connection.readyState === 1;
    let dbLatencyMs: number | null = null;

    if (isDbConnected && mongoose.connection.db) {
      const dbStart = Date.now();
      try {
        await mongoose.connection.db.admin().ping();
        dbLatencyMs = Date.now() - dbStart;
      } catch {
        dbLatencyMs = null;
      }
    }

    const isHealthy = isDbConnected;

    return {
      status: isHealthy ? "HEALTHY" : "DEGRADED",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: isDbConnected ? "CONNECTED" : "DISCONNECTED",
        latencyMs: dbLatencyMs,
        name: mongoose.connection.name || "portfolio",
      },
    };
  },

  /**
   * Retrieve detailed system and traffic metrics
   */
  async getMetrics() {
    const health = await this.getHealth();
    const mem = process.memoryUsage();

    const avgLatencyMs =
      metrics.totalRequests > 0
        ? Number((metrics.totalDurationMs / metrics.totalRequests).toFixed(2))
        : 0;

    const errorRatePercent =
      metrics.totalRequests > 0
        ? Number(
            (
              ((metrics.status4xx + metrics.status5xx) /
                metrics.totalRequests) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      server: {
        startTime: serverStartTime.toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
      },
      health: health.status,
      database: health.database,
      memory: {
        rssMb: Number((mem.rss / 1024 / 1024).toFixed(2)),
        heapTotalMb: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
        heapUsedMb: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
        externalMb: Number((mem.external / 1024 / 1024).toFixed(2)),
      },
      traffic: {
        totalRequests: metrics.totalRequests,
        status2xx: metrics.status2xx,
        status3xx: metrics.status3xx,
        status4xx: metrics.status4xx,
        status5xx: metrics.status5xx,
        avgLatencyMs,
        errorRatePercent,
      },
    };
  },
};
