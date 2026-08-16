import type { Request, Response, NextFunction } from "express";
import { CloudinaryService } from "../services/cloudinary.service.js";
import { BadRequestError } from "../errors/app.error.js";

export const UploadController = {
  
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.body.file || req.body.image;
      const folder =
        typeof req.body.folder === "string" ? req.body.folder : "portfolio";

      if (!file || typeof file !== "string") {
        throw new BadRequestError(
          "Image 'file' (base64 string or image URL) is required",
        );
      }

      const result = await CloudinaryService.uploadImage(file, { folder });

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          ...result,
          url: result.secureUrl,
        },
      });

    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const publicId = req.body.publicId || req.query.publicId;

      if (!publicId || typeof publicId !== "string") {
        throw new BadRequestError("publicId is required");
      }

      const result = await CloudinaryService.deleteImage(publicId);

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
