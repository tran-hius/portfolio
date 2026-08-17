import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables immediately and handle potential CWD differences
dotenv.config();
try {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(currentDir, "../../.env") });
  dotenv.config({ path: path.resolve(currentDir, "../../../.env") });
} catch {
  // Ignore fallback error
}

interface CloudinaryConfig {
  readonly cloudName: string;
  readonly apiKey: string;
  readonly apiSecret: string;
  readonly isConfigured: boolean;
}

const parseCloudinaryUrl = (
  url?: string,
): {
  cloudName?: string | undefined;
  apiKey?: string | undefined;
  apiSecret?: string | undefined;
} => {
  if (!url || !url.startsWith("cloudinary://")) {
    return {};
  }

  try {
    const raw = url.replace("cloudinary://", "");
    const [credentials, cloudName] = raw.split("@");
    if (!credentials || !cloudName) return {};
    const [apiKey, apiSecret] = credentials.split(":");
    return { cloudName, apiKey, apiSecret };
  } catch {
    return {};
  }
};

export const cloudinaryConfig: CloudinaryConfig = {
  get cloudName(): string {
    const parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
    return (
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_NAME ||
      parsed.cloudName ||
      ""
    );
  },

  get apiKey(): string {
    const parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
    return (
      process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_KEY ||
      parsed.apiKey ||
      ""
    );
  },

  get apiSecret(): string {
    const parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
    return (
      process.env.CLOUDINARY_API_SECRET ||
      process.env.CLOUDINARY_SECRET ||
      parsed.apiSecret ||
      ""
    );
  },

  get isConfigured(): boolean {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  },
};
