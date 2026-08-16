import crypto from "crypto";
import { cloudinaryConfig } from "../config/cloudinary.config.js";
import { BadRequestError, InternalServerError } from "../errors/app.error.js";

export interface UploadImageResult {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export const CloudinaryService = {
  
  generateSignature(params: Record<string, string | number>): string {
    const sortedKeys = Object.keys(params).sort();
    const stringToSign =
      sortedKeys.map((key) => `${key}=${params[key]}`).join("&") +
      cloudinaryConfig.apiSecret;

    return crypto.createHash("sha1").update(stringToSign).digest("hex");
  },

  async uploadImage(
    file: string,
    options: {
      folder?: string | undefined;
      publicId?: string | undefined;
    } = {},
  ): Promise<UploadImageResult> {
    if (!cloudinaryConfig.isConfigured) {
      throw new InternalServerError(
        "Cloudinary credentials are not configured in environment variables",
      );
    }

    if (!file || typeof file !== "string") {
      throw new BadRequestError("Image file (base64 or URL) is required");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signParams: Record<string, string | number> = {
      timestamp,
    };

    if (options.folder) {
      signParams.folder = options.folder;
    }

    if (options.publicId) {
      signParams.public_id = options.publicId;
    }

    const signature = this.generateSignature(signParams);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    if (options.folder) {
      formData.append("folder", options.folder);
    }
    if (options.publicId) {
      formData.append("public_id", options.publicId);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data: any = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error?.message || "Failed to upload image to Cloudinary";
        throw new BadRequestError(`Cloudinary Error: ${errorMsg}`);
      }

      return {
        secureUrl: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw new InternalServerError(
        `Failed to upload image to Cloudinary: ${error.message}`,
      );
    }
  },

  async deleteImage(publicId: string): Promise<{ result: string }> {
    if (!cloudinaryConfig.isConfigured) {
      throw new InternalServerError(
        "Cloudinary credentials are not configured in environment variables",
      );
    }

    if (!publicId || typeof publicId !== "string") {
      throw new BadRequestError("publicId is required");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signParams: Record<string, string | number> = {
      public_id: publicId,
      timestamp,
    };

    const signature = this.generateSignature(signParams);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`;

    try {
      const response = await fetch(destroyUrl, {
        method: "POST",
        body: formData,
      });

      const data: any = await response.json();

      if (!response.ok || data.result !== "ok") {
        throw new BadRequestError(
          data.error?.message || `Failed to delete image: ${data.result}`,
        );
      }

      return { result: data.result };
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw new InternalServerError(
        `Failed to delete image from Cloudinary: ${error.message}`,
      );
    }
  },
};
