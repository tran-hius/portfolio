import type { Request, Response, NextFunction } from "express";
import { EducationService } from "../services/education.service.js";
import { BadRequestError } from "../errors/app.error.js";

export const EducationController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isCurrentQuery = req.query.isCurrent;
      const isCurrent =
        isCurrentQuery !== undefined ? isCurrentQuery === "true" : undefined;
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const data = await EducationService.findAll({
        isCurrent,
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
        throw new BadRequestError("Education ID is required");
      }

      const education = await EducationService.findById(id);

      return res.status(200).json({
        success: true,
        data: education,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await EducationService.create(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Education created successfully",
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
        throw new BadRequestError("Education ID is required");
      }

      const userId = req.user!.userId;
      const result = await EducationService.updateById(id, userId, req.body);

      return res.status(200).json({
        success: true,
        message: "Education updated successfully",
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
        throw new BadRequestError("Education ID is required");
      }

      const userId = req.user!.userId;
      const result = await EducationService.deleteById(id, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
