import { fetchWithAuth } from "./client.js";
import type { SystemMetrics } from "../types/portfolio.js";

export const systemService = {
  async fetchSystemMetrics(): Promise<SystemMetrics | null> {
    try {
      const res = await fetchWithAuth<{ success: boolean; data: SystemMetrics }>("/system/metrics");
      return res.data || null;
    } catch {
      return null;
    }
  },
};

export const fetchSystemMetrics = systemService.fetchSystemMetrics;
