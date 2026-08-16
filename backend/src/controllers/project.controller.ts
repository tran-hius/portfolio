import type { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service.js";
import { BadRequestError } from "../errors/app.error.js";

export const ProjectController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isFeaturedQuery = req.query.isFeatured;
      const isFeatured =
        isFeaturedQuery !== undefined
          ? isFeaturedQuery === "true"
          : undefined;
      const technology =
        typeof req.query.technology === "string"
          ? req.query.technology
          : undefined;
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const projects = await ProjectService.findAll({
        isFeatured,
        technology,
        search,
      });

      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        throw new BadRequestError("Project ID is required");
      }

      const project = await ProjectService.findById(id);

      return res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await ProjectService.create(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
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
        throw new BadRequestError("Project ID is required");
      }

      const userId = req.user!.userId;
      const result = await ProjectService.updateById(id, userId, req.body);

      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
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
        throw new BadRequestError("Project ID is required");
      }

      const userId = req.user!.userId;
      const result = await ProjectService.deleteById(id, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
