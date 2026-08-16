interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  isConfigured: boolean;
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

const parsedFromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_NAME ||
  parsedFromUrl.cloudName ||
  "";

const apiKey =
  process.env.CLOUDINARY_API_KEY ||
  process.env.CLOUDINARY_KEY ||
  parsedFromUrl.apiKey ||
  "";

const apiSecret =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_SECRET ||
  parsedFromUrl.apiSecret ||
  "";

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName,
  apiKey,
  apiSecret,
  isConfigured: Boolean(cloudName && apiKey && apiSecret),
};
