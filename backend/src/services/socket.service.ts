import type { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";
import { AnalyticsService } from "./analytics.service.js";
import { Logger } from "../utils/logger.util.js";
import type { IVisitor } from "../schema/visitor.schema.js";

let io: SocketIOServer | null = null;
const activeSockets = new Map<
  string,
  { ip: string; connectedAt: Date; isAdmin: boolean }
>();

const getClientIpFromSocket = (socket: Socket): string => {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  let rawIp = "";

  if (typeof forwarded === "string") {
    rawIp = forwarded.split(",")[0]?.trim() || "";
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    rawIp = (forwarded[0] ?? "").split(",")[0]?.trim() || "";
  }

  if (!rawIp) {
    rawIp = socket.handshake.address || "127.0.0.1";
  }

  return rawIp.replace(/^::ffff:/, "");
};

const verifyAdminToken = (token: string | undefined): boolean => {
  if (!token) return false;
  try {
    let cleanToken = token;
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1);
    }
    const decoded = jwt.verify(cleanToken, envConfig.JWT_ACCESS_SECRET) as {
      role?: string;
    };
    return decoded?.role?.toLowerCase() === "admin";
  } catch {
    return false;
  }
};

export const SocketService = {
  init(httpServer: HttpServer): SocketIOServer {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          const allowedOrigins = envConfig.CORS_ORIGINS;
          if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          if (
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1") ||
            origin.includes("onrender.com")
          ) {
            return callback(null, true);
          }
          return callback(null, false);
        },
        credentials: true,
        methods: ["GET", "POST"],
      },
      pingTimeout: 30000,
      pingInterval: 25000,
    });

    io.on("connection", async (socket: Socket) => {
      const clientIp = getClientIpFromSocket(socket);
      const userAgent =
        (socket.handshake.headers["user-agent"] as string) || "Unknown";
      const rawReferer =
        socket.handshake.headers.referer || socket.handshake.headers.referrer;
      const referer =
        typeof rawReferer === "string" ? rawReferer : undefined;
      const path = (socket.handshake.query?.path as string) || "/";
      const authHeader = socket.handshake.headers.authorization;
      let token = socket.handshake.auth?.token;

      if (!token && authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }

      const isAdmin = verifyAdminToken(token);
      if (isAdmin) {
        socket.join("admin_room");
      }

      activeSockets.set(socket.id, {
        ip: clientIp,
        connectedAt: new Date(),
        isAdmin,
      });

      const onlineCount = SocketService.getActiveVisitorCount();
      // Send current count to this client
      socket.emit("visitor:onlineCount", onlineCount);
      // Broadcast updated online count to all clients
      socket.broadcast.emit("visitor:onlineCount", onlineCount);

      // Handle dynamic admin authentication after initial connection
      socket.on("admin:authenticate", async (adminToken: string) => {
        if (verifyAdminToken(adminToken)) {
          socket.join("admin_room");
          const entry = activeSockets.get(socket.id);
          if (entry) entry.isAdmin = true;

          socket.emit("admin:authenticated", { success: true });

          // Send immediate stats & online count
          try {
            const stats = await AnalyticsService.getStats();
            socket.emit("visitor:statsUpdate", stats);
            socket.emit("visitor:onlineCount", SocketService.getActiveVisitorCount());
          } catch {}
        } else {
          socket.emit("admin:authenticated", {
            success: false,
            message: "Invalid admin token",
          });
        }
      });

      // Handle SPA navigation page views
      socket.on(
        "visitor:pageView",
        async (payload: { path?: string; referer?: string }) => {
          try {
            const newPath = payload?.path || "/";
            const newReferer = payload?.referer || referer;

            const log = await AnalyticsService.logVisit({
              ip: clientIp,
              userAgent,
              path: newPath,
              method: "GET",
              referer: newReferer,
            });

            if (log) {
              SocketService.broadcastNewLog(log);
            }

            const stats = await AnalyticsService.getStats();
            SocketService.broadcastStats(stats);
          } catch (err) {
            Logger.error("Failed to log SPA page view:", err);
          }
        },
      );

      // Log initial visit (unless it's an admin accessing the admin area)
      const isAdminArea = path.startsWith("/admin");
      if (!isAdmin || !isAdminArea) {
        AnalyticsService.logVisit({
          ip: clientIp,
          userAgent,
          path,
          method: "GET",
          referer,
        })
          .then(async (log) => {
            if (log) {
              SocketService.broadcastNewLog(log);
            }
            const stats = await AnalyticsService.getStats();
            SocketService.broadcastStats(stats);
          })
          .catch((err) => {
            Logger.error("Error logging socket visit:", err);
          });
      } else {
        // Just send current stats to the admin
        AnalyticsService.getStats()
          .then((stats) => socket.emit("visitor:statsUpdate", stats))
          .catch(() => {});
      }

      socket.on("disconnect", async () => {
        activeSockets.delete(socket.id);
        const newCount = SocketService.getActiveVisitorCount();
        if (io) {
          io.emit("visitor:onlineCount", newCount);
          try {
            const stats = await AnalyticsService.getStats();
            SocketService.broadcastStats(stats);
          } catch {}
        }
      });
    });

    Logger.info("Socket.io initialized successfully.");
    return io;
  },

  getIO(): SocketIOServer | null {
    return io;
  },

  getActiveVisitorCount(): number {
    const uniqueIPs = new Set<string>();
    for (const client of activeSockets.values()) {
      uniqueIPs.add(client.ip);
    }
    return uniqueIPs.size;
  },

  broadcastNewLog(log: IVisitor | any) {
    if (io) {
      io.to("admin_room").emit("visitor:newLog", log);
    }
  },

  broadcastStats(stats: any) {
    if (io) {
      io.to("admin_room").emit("visitor:statsUpdate", stats);
    }
  },

  broadcastOnlineCount(count: number) {
    if (io) {
      io.emit("visitor:onlineCount", count);
    }
  },
};
