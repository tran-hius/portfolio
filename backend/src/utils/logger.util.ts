type LogLevel = "info" | "warn" | "error" | "debug" | "http";

const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  bold: "\x1b[1m",
};

const getTimestamp = (): string => {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
};

export class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    meta?: any,
  ): string {
    const timestamp = `${COLORS.gray}[${getTimestamp()}]${COLORS.reset}`;
    let levelBadge = "";

    switch (level) {
      case "info":
        levelBadge = `${COLORS.green}${COLORS.bold}[INFO]${COLORS.reset}`;
        break;
      case "warn":
        levelBadge = `${COLORS.yellow}${COLORS.bold}[WARN]${COLORS.reset}`;
        break;
      case "error":
        levelBadge = `${COLORS.red}${COLORS.bold}[ERROR]${COLORS.reset}`;
        break;
      case "http":
        levelBadge = `${COLORS.cyan}${COLORS.bold}[HTTP]${COLORS.reset}`;
        break;
      case "debug":
        levelBadge = `${COLORS.magenta}${COLORS.bold}[DEBUG]${COLORS.reset}`;
        break;
    }

    let formatted = `${timestamp} ${levelBadge} ${message}`;

    if (meta !== undefined) {
      if (meta instanceof Error) {
        formatted += `\n${COLORS.red}${meta.stack || meta.message}${COLORS.reset}`;
      } else if (typeof meta === "object") {
        formatted += ` ${COLORS.gray}${JSON.stringify(meta)}${COLORS.reset}`;
      } else {
        formatted += ` ${meta}`;
      }
    }

    return formatted;
  }

  static info(message: string, meta?: any): void {
    console.log(this.formatMessage("info", message, meta));
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage("warn", message, meta));
  }

  static error(message: string, error?: any, meta?: any): void {
    console.error(this.formatMessage("error", message, error || meta));
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatMessage("debug", message, meta));
    }
  }

  static http(
    method: string,
    url: string,
    statusCode: number,
    durationMs: number,
    ip: string,
  ): void {
    let statusColor = COLORS.green;
    if (statusCode >= 500) statusColor = COLORS.red;
    else if (statusCode >= 400) statusColor = COLORS.yellow;
    else if (statusCode >= 300) statusColor = COLORS.cyan;

    const message = `${COLORS.bold}${method}${COLORS.reset} ${url} ${statusColor}${statusCode}${COLORS.reset} - ${durationMs.toFixed(1)}ms (${COLORS.gray}${ip}${COLORS.reset})`;
    console.log(this.formatMessage("http", message));
  }
}
