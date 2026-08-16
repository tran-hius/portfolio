import { fetchWithAuth } from "./client.js";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to encode file as base64 string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadService = {
  async uploadImage(
    file: File,
    folder = "portfolio",
  ): Promise<{ url: string; secureUrl: string; publicId: string }> {
    const base64 = await fileToBase64(file);

    const res = await fetchWithAuth<{
      success: boolean;
      data: { url?: string; secureUrl?: string; publicId?: string };
    }>("/upload", {
      method: "POST",
      body: JSON.stringify({ file: base64, folder }),
    });

    if (!res || !res.data) {
      throw new Error("Upload response was empty or invalid");
    }

    const secureUrl = res.data.secureUrl || res.data.url || "";
    const url = res.data.url || res.data.secureUrl || "";
    const publicId = res.data.publicId || "";

    return {
      url,
      secureUrl,
      publicId,
    };
  },
};

export const uploadImage = uploadService.uploadImage;
