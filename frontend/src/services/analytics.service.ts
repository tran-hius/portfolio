import { API_BASE, fetchWithAuth } from "./client.js";

export interface VisitorLogsResponse {
  visitors: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    totalDistinctIPs: number;
    todayUniqueIPs: number;
  };
}

export const analyticsService = {
  
  subscribeToRealtimeVisitors(onCountUpdate: (count: number) => void): () => void {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`${API_BASE}/analytics/realtime`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.activeVisitors === "number") {
            onCountUpdate(data.activeVisitors);
          }
        } catch (err) {
          console.warn("Failed to parse SSE payload:", err);
        }
      };

      eventSource.onerror = () => {
        
      };
    } catch (err) {
      console.warn("EventSource connection error:", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  },

  async fetchVisitorLogs(page = 1, limit = 20): Promise<VisitorLogsResponse> {
    try {
      const res = await fetchWithAuth<{ success: boolean; data: any }>(
        `/analytics/visitors?page=${page}&limit=${limit}`,
      );
      const data = res?.data || res;
      const rawStats = data?.stats || {};
      const todayUnique = Number(
        rawStats.todayUniqueIPs ?? rawStats.uniqueVisitorsToday ?? 0,
      );
      const totalDistinct = Number(
        rawStats.totalDistinctIPs ?? rawStats.totalUniqueVisitors ?? 0,
      );

      return {
        visitors: Array.isArray(data?.visitors) ? data.visitors : [],
        pagination: data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 },
        stats: {
          totalDistinctIPs: isNaN(totalDistinct) ? 0 : totalDistinct,
          todayUniqueIPs: isNaN(todayUnique) ? 0 : todayUnique,
        },
      };
    } catch {
      return {
        visitors: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
        stats: { totalDistinctIPs: 0, todayUniqueIPs: 0 },
      };
    }
  },
};

export const subscribeToRealtimeVisitors = analyticsService.subscribeToRealtimeVisitors;
export const fetchVisitorLogs = analyticsService.fetchVisitorLogs;
