import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
try {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(currentDir, "../../.env") });
  dotenv.config({ path: path.resolve(currentDir, "../../../.env") });
} catch {
  // Ignore fallback error
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`FATAL: Environment variable '${key}' is missing.`);
  }
  return value;
};

export const envConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  PORT: Number(process.env.PORT || 3001),
  MONGO_URI: getEnv("MONGO_URI", "mongodb://localhost:27017/portfolio"),
  JWT_ACCESS_SECRET: getEnv(
    "JWT_ACCESS_SECRET",
    "default-dev-jwt-access-secret-32chars-min-len",
  ),
  JWT_REFRESH_SECRET: getEnv(
    "JWT_REFRESH_SECRET",
    "default-dev-jwt-refresh-secret-32chars-min-len",
  ),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
  CORS_ORIGINS: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:8888",
      ],
};
