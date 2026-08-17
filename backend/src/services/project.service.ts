import { projectRepository } from "../repositories/project.repository.js";
import { ProjectMapper } from "../mappers/project.mapper.js";
import type { CreateProjectDTO } from "../dtos/create-project.dto.js";
import type { UpdateProjectDTO } from "../dtos/update-project.dto.js";
import type { ProjectResponseDTO } from "../dtos/project-response.dto.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../errors/app.error.js";

export interface ProjectFilter {
  isFeatured?: boolean | undefined;
  technology?: string | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface PaginatedProjectsResult {
  projects: ProjectResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const escapeRegex = (str: string): string => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const ProjectService = {
  async create(
    userId: string,
    data: CreateProjectDTO,
  ): Promise<ProjectResponseDTO> {
    if (!data.title || !data.description) {
      throw new BadRequestError("Title and description are required");
    }

    const image = data.imageUrl || data.thumbnail || null;
    const live = data.liveUrl || data.demoUrl || null;

    const newProject = await projectRepository.create({
      ...data,
      category: data.category?.trim() || "Architecture",
      thumbnail: image,
      imageUrl: image,
      demoUrl: live,
      liveUrl: live,
      userId,
    });

    return ProjectMapper.toResponse(newProject);
  },

  async findAll(
    filter: ProjectFilter = {},
  ): Promise<PaginatedProjectsResult> {
    const mongoFilter: any = {};

    if (typeof filter.isFeatured === "boolean") {
      mongoFilter.isFeatured = filter.isFeatured;
    }

    if (filter.technology) {
      const safeTech = escapeRegex(filter.technology);
      mongoFilter.technologies = {
        $regex: new RegExp(`^${safeTech}$`, "i"),
      };
    }

    if (filter.search) {
      const safeSearch = escapeRegex(filter.search);
      mongoFilter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const total = await projectRepository.count(mongoFilter);
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filter.limit) || 20));
    const skip = (page - 1) * limit;

    const projects = await projectRepository.findAll(mongoFilter, {
      sort: { createdAt: -1 },
      skip,
      limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      projects: ProjectMapper.toResponseList(projects),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async findById(id: string): Promise<ProjectResponseDTO> {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError(`Project with id ${id} not found`);
    }

    return ProjectMapper.toResponse(project);
  },

  async updateById(
    id: string,
    userId: string,
    data: UpdateProjectDTO,
  ): Promise<ProjectResponseDTO> {
    const existing = await projectRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Project with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this project",
      );
    }

    const updatePayload: any = { ...data };

    if (data.imageUrl !== undefined || data.thumbnail !== undefined) {
      const img = data.imageUrl !== undefined ? data.imageUrl : data.thumbnail;
      updatePayload.imageUrl = img;
      updatePayload.thumbnail = img;
    }

    if (data.liveUrl !== undefined || data.demoUrl !== undefined) {
      const live = data.liveUrl !== undefined ? data.liveUrl : data.demoUrl;
      updatePayload.liveUrl = live;
      updatePayload.demoUrl = live;
    }

    if (data.category !== undefined) {
      updatePayload.category = data.category ? String(data.category).trim() : "Architecture";
    }

    const updated = await projectRepository.updateById(id, updatePayload);
    return ProjectMapper.toResponse(updated);
  },

  async deleteById(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await projectRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Project with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this project",
      );
    }

    await projectRepository.deleteById(id);

    return {
      success: true,
      message: "Project deleted successfully",
    };
  },
};

