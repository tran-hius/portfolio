import dotenv from "dotenv";
dotenv.config();

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
};
