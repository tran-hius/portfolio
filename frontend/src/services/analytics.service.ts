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
      const res = await fetchWithAuth<{ success: boolean; data: VisitorLogsResponse }>(
        `/analytics/visitors?page=${page}&limit=${limit}`,
      );
      return res.data;
    } catch {
      return {
        visitors: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
        stats: { totalDistinctIPs: 1, todayUniqueIPs: 1 },
      };
    }
  },
};

export const subscribeToRealtimeVisitors = analyticsService.subscribeToRealtimeVisitors;
export const fetchVisitorLogs = analyticsService.fetchVisitorLogs;
