import type { Response } from "express";
import {
  visitorRepository,
  type CreateVisitorDTO,
} from "../repositories/visitor.repository.js";

interface ActiveClient {
  res: Response;
  ip: string;
  connectedAt: Date;
}

const activeClients = new Map<Response, ActiveClient>();

const escapeRegex = (str: string): string => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const AnalyticsService = {
  
  async logVisit(data: CreateVisitorDTO) {
    try {
      return await visitorRepository.create(data);
    } catch (error) {
      console.error("Failed to log visitor:", error);
      return null;
    }
  },

  addClient(res: Response, ip: string) {
    activeClients.set(res, {
      res,
      ip,
      connectedAt: new Date(),
    });

    const currentCount = this.getActiveVisitorCount();
    res.write(`data: ${JSON.stringify({ activeVisitors: currentCount })}\n\n`);

    this.broadcastActiveCount();
  },

  removeClient(res: Response) {
    activeClients.delete(res);
    this.broadcastActiveCount();
  },

  getActiveVisitorCount(): number {
    const uniqueIPs = new Set<string>();
    for (const client of activeClients.values()) {
      uniqueIPs.add(client.ip);
    }
    return uniqueIPs.size;
  },

  broadcastActiveCount() {
    const count = this.getActiveVisitorCount();
    const payload = `data: ${JSON.stringify({ activeVisitors: count })}\n\n`;

    for (const client of activeClients.values()) {
      try {
        client.res.write(payload);
      } catch (err) {
        
        activeClients.delete(client.res);
      }
    }
  },

  async getStats() {
    const [totalVisits, totalUniqueVisitors, uniqueVisitorsToday] =
      await Promise.all([
        visitorRepository.count(),
        visitorRepository.countDistinctIPs(),
        visitorRepository.countTodayUniqueIPs(),
      ]);

    return {
      activeVisitors: this.getActiveVisitorCount(),
      totalVisits,
      uniqueVisitorsToday,
      totalUniqueVisitors,
    };
  },

  async getLogs(options: {
    page?: number | undefined;
    limit?: number | undefined;
    searchIp?: string | undefined;
  }) {
    const { page = 1, limit = 50, searchIp } = options;
    const filter: Record<string, any> = {};

    if (searchIp && typeof searchIp === "string") {
      const safeSearchIp = escapeRegex(searchIp.trim());
      filter.ip = { $regex: safeSearchIp, $options: "i" };
    }

    const total = await visitorRepository.count(filter);
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const logs = await visitorRepository.findAll(filter, {
      sort: { visitedAt: -1 },
      skip,
      limit: safeLimit,
    });

    const totalPages = Math.ceil(total / safeLimit) || 1;

    return {
      logs,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    };
  },
};
