import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import { envConfig } from "./config/env.config.js";
import authRouter from "./routers/auth.routes.js";
import projectRouter from "./routers/project.routes.js";
import skillRouter from "./routers/skill.routes.js";
import experienceRouter from "./routers/experience.routes.js";
import educationRouter from "./routers/education.routes.js";
import certificateRouter from "./routers/certificate.routes.js";
import analyticsRouter from "./routers/analytics.routes.js";
import monitoringRouter from "./routers/monitoring.routes.js";
import uploadRouter from "./routers/upload.routes.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { AuthService } from "./services/auth.service.js";
import { Logger } from "./utils/logger.util.js";


const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://localhost:8888",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "x-admin-secret"],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(requestLogger);

app.use("/health", monitoringRouter);
app.use("/api/v1/system", monitoringRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/experiences", experienceRouter);
app.use("/api/v1/education", educationRouter);
app.use("/api/v1/certificates", certificateRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.use(errorHandler);

const PORT = envConfig.PORT;

const startServer = async () => {
  try {
    await connectDB();
    await AuthService.seedInitialAdmin();
  } catch (error) {
    Logger.error("MongoDB connection notice (will auto-reconnect):", error);
  }


  const server = app.listen(PORT, () => {
    Logger.info(`Server is running on port: ${PORT} (http://localhost:${PORT})`);
  });

  const shutdown = async (signal: string) => {
    Logger.warn(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        Logger.info("MongoDB connection closed.");
        process.exit(0);
      } catch (err) {
        Logger.error("Error during shutdown:", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer();
