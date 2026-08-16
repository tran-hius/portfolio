import type { Request, Response, NextFunction } from "express";
import { ExperienceService } from "../services/experience.service.js";
import { BadRequestError } from "../errors/app.error.js";

export const ExperienceController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isCurrentQuery = req.query.isCurrent;
      const isCurrent =
        isCurrentQuery !== undefined ? isCurrentQuery === "true" : undefined;
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const data = await ExperienceService.findAll({
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
        throw new BadRequestError("Experience ID is required");
      }

      const experience = await ExperienceService.findById(id);

      return res.status(200).json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await ExperienceService.create(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Experience created successfully",
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
        throw new BadRequestError("Experience ID is required");
      }

      const userId = req.user!.userId;
      const result = await ExperienceService.updateById(id, userId, req.body);

      return res.status(200).json({
        success: true,
        message: "Experience updated successfully",
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
        throw new BadRequestError("Experience ID is required");
      }

      const userId = req.user!.userId;
      const result = await ExperienceService.deleteById(id, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
