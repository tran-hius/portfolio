import { envConfig } from "../config/env.config.js";

/**
 * Validates whether an incoming HTTP/WebSocket origin is permitted.
 */
export const isOriginAllowed = (origin?: string): boolean => {
  // Allow non-browser requests (e.g. mobile clients, server-to-server, curl)
  if (!origin) return true;

  const allowedOrigins = envConfig.CORS_ORIGINS;

  // Wildcard configured or exact match in configured origins
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    return true;
  }

  // Local development origins
  if (
    origin.includes("localhost") ||
    origin.includes("127.0.0.1")
  ) {
    return true;
  }

  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();

    // Production domain, custom domain & project-specific Vercel preview deployments
    if (
      host === "hieutran-theta.vercel.app" ||
      host.endsWith(".hieutran-theta.vercel.app") ||
      (host.startsWith("hieutran-") && host.endsWith(".vercel.app")) ||
      host === "tranhieu.dev" ||
      host.endsWith(".tranhieu.dev")
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};
