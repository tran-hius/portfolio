import type { Request, Response, NextFunction } from "express";
import { CertificateService } from "../services/certificate.service.js";
import { BadRequestError } from "../errors/app.error.js";

export const CertificateController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const issuer =
        typeof req.query.issuer === "string" ? req.query.issuer : undefined;
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const data = await CertificateService.findAll({
        issuer,
        search,
      });

      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        throw new BadRequestError("Certificate ID is required");
      }

      const certificate = await CertificateService.findById(id);

      return res.status(200).json({
        success: true,
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await CertificateService.create(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Certificate created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        throw new BadRequestError("Certificate ID is required");
      }

      const userId = req.user!.userId;
      const result = await CertificateService.updateById(
        id,
        userId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Certificate updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        throw new BadRequestError("Certificate ID is required");
      }

      const userId = req.user!.userId;
      const result = await CertificateService.deleteById(id, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
