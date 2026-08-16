import type { Request, Response, NextFunction } from "express";
import { SkillService } from "../services/skill.service.js";
import { BadRequestError } from "../errors/app.error.js";

export const SkillController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isFeaturedQuery = req.query.isFeatured;
      const isFeatured =
        isFeaturedQuery !== undefined
          ? isFeaturedQuery === "true"
          : undefined;

      const category =
        typeof req.query.category === "string"
          ? req.query.category
          : undefined;

      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const grouped = req.query.grouped === "true";

      const data = await SkillService.findAll({
        isFeatured,
        category,
        search,
        grouped,
      });

      return res.status(200).json({
        success: true,
        count: Array.isArray(data) ? data.length : Object.keys(data).length,
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
        throw new BadRequestError("Skill ID is required");
      }

      const skill = await SkillService.findById(id);

      return res.status(200).json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await SkillService.create(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Skill created successfully",
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
        throw new BadRequestError("Skill ID is required");
      }

      const userId = req.user!.userId;
      const result = await SkillService.updateById(id, userId, req.body);

      return res.status(200).json({
        success: true,
        message: "Skill updated successfully",
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
        throw new BadRequestError("Skill ID is required");
      }

      const userId = req.user!.userId;
      const result = await SkillService.deleteById(id, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
