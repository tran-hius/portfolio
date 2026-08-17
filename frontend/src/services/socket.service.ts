import { io, Socket } from "socket.io-client";
import { API_BASE, getStoredToken } from "./client.js";

let socketInstance: Socket | null = null;

const getSocketServerUrl = (): string => {
  return API_BASE.replace(/\/api\/v1\/?$/, "");
};

export const getSocket = (): Socket => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (!socketInstance) {
    const url = getSocketServerUrl();
    const token = getStoredToken();

    socketInstance = io(url, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: token || undefined,
      },
      query: {
        path: typeof window !== "undefined" ? window.location.pathname + window.location.hash : "/",
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    if (typeof window !== "undefined") {
      window.addEventListener("auth:refreshed", (e: any) => {
        const newToken = e.detail?.token || getStoredToken();
        if (socketInstance && newToken) {
          socketInstance.auth = { token: newToken };
          socketInstance.emit("admin:authenticate", newToken);
        }
      });

      window.addEventListener("auth:unauthorized", () => {
        if (socketInstance) {
          socketInstance.auth = { token: undefined };
        }
      });
    }
  }

  return socketInstance;
};

export const subscribeOnlineVisitors = (
  onCountUpdate: (count: number) => void,
): (() => void) => {
  const socket = getSocket();

  const handleOnlineCount = (count: number) => {
    if (typeof count === "number") {
      onCountUpdate(count);
    }
  };

  socket.on("visitor:onlineCount", handleOnlineCount);

  // If socket is not connected yet, connect it
  if (!socket.connected) {
    socket.connect();
  }

  return () => {
    socket.off("visitor:onlineCount", handleOnlineCount);
  };
};

export interface VisitorTelemetryCallbacks {
  onNewLog?: (log: any) => void;
  onStatsUpdate?: (stats: {
    totalDistinctIPs?: number;
    todayUniqueIPs?: number;
    totalVisits?: number;
    activeVisitors?: number;
    totalUniqueVisitors?: number;
    uniqueVisitorsToday?: number;
  }) => void;
  onOnlineCount?: (count: number) => void;
}

export const subscribeAdminVisitorTelemetry = (
  callbacks: VisitorTelemetryCallbacks,
): (() => void) => {
  const socket = getSocket();
  const token = getStoredToken();

  if (token) {
    socket.auth = { token };
    socket.emit("admin:authenticate", token);
  }

  const handleNewLog = (log: any) => {
    callbacks.onNewLog?.(log);
  };

  const handleStatsUpdate = (stats: any) => {
    callbacks.onStatsUpdate?.(stats);
  };

  const handleOnlineCount = (count: number) => {
    callbacks.onOnlineCount?.(count);
  };

  socket.on("visitor:newLog", handleNewLog);
  socket.on("visitor:statsUpdate", handleStatsUpdate);
  socket.on("visitor:onlineCount", handleOnlineCount);

  if (!socket.connected) {
    socket.connect();
  }

  return () => {
    socket.off("visitor:newLog", handleNewLog);
    socket.off("visitor:statsUpdate", handleStatsUpdate);
    socket.off("visitor:onlineCount", handleOnlineCount);
  };
};

export const trackPageView = (path: string, referer?: string) => {
  try {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("visitor:pageView", {
        path: path || window.location.pathname + window.location.hash,
        referer: referer || (typeof document !== "undefined" ? document.referrer : undefined),
      });
    }
  } catch (err) {
    console.warn("Failed to send socket page view:", err);
  }
};
