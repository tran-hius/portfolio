import { experienceRepository } from "../repositories/experience.repository.js";
import { ExperienceMapper } from "../mappers/experience.mapper.js";
import type { CreateExperienceDTO } from "../dtos/create-experience.dto.js";
import type { UpdateExperienceDTO } from "../dtos/update-experience.dto.js";
import type { ExperienceResponseDTO } from "../dtos/experience-response.dto.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../errors/app.error.js";

export interface ExperienceFilter {
  isCurrent?: boolean | undefined;
  search?: string | undefined;
}

const escapeRegex = (str: string): string => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const cleanString = (val?: any): string | null => {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
};

export const ExperienceService = {
  async create(
    userId: string,
    data: CreateExperienceDTO,
  ): Promise<ExperienceResponseDTO> {
    const company = cleanString(data.company);
    const position = cleanString(data.position);
    const startDate = cleanString(data.startDate);

    if (!company) {
      throw new BadRequestError("Company name is required");
    }
    if (!position) {
      throw new BadRequestError("Position is required");
    }
    if (!startDate) {
      throw new BadRequestError("Start date is required");
    }

    const isCurrent = Boolean(data.isCurrent);
    const endDate = isCurrent ? null : cleanString(data.endDate);
    const location = cleanString(data.location);
    const description = cleanString(data.description);
    const technologies = Array.isArray(data.technologies)
      ? data.technologies.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const newExp = await experienceRepository.create({
      company,
      position,
      startDate,
      endDate,
      isCurrent,
      location,
      description,
      technologies,
      order: typeof data.order === "number" ? data.order : 0,
      userId,
    });

    return ExperienceMapper.toResponse(newExp);
  },

  async findAll(
    filter: ExperienceFilter = {},
  ): Promise<ExperienceResponseDTO[]> {
    const mongoFilter: Record<string, any> = {};

    if (typeof filter.isCurrent === "boolean") {
      mongoFilter.isCurrent = filter.isCurrent;
    }

    if (filter.search) {
      const safeSearch = escapeRegex(filter.search);
      mongoFilter.$or = [
        { company: { $regex: safeSearch, $options: "i" } },
        { position: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const experiences = await experienceRepository.findAll(mongoFilter);
    return ExperienceMapper.toResponseList(experiences);
  },

  async findById(id: string): Promise<ExperienceResponseDTO> {
    const experience = await experienceRepository.findById(id);

    if (!experience) {
      throw new NotFoundError(`Experience with id ${id} not found`);
    }

    return ExperienceMapper.toResponse(experience);
  },

  async updateById(
    id: string,
    userId: string,
    data: UpdateExperienceDTO,
  ): Promise<ExperienceResponseDTO> {
    const existing = await experienceRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Experience with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this experience",
      );
    }

    const updatePayload: Record<string, any> = {};

    if (data.company !== undefined) {
      const company = cleanString(data.company);
      if (!company) throw new BadRequestError("Company name cannot be empty");
      updatePayload.company = company;
    }

    if (data.position !== undefined) {
      const position = cleanString(data.position);
      if (!position) throw new BadRequestError("Position cannot be empty");
      updatePayload.position = position;
    }

    if (data.startDate !== undefined) {
      const startDate = cleanString(data.startDate);
      if (!startDate) throw new BadRequestError("Start date cannot be empty");
      updatePayload.startDate = startDate;
    }

    if (data.isCurrent !== undefined) {
      updatePayload.isCurrent = Boolean(data.isCurrent);
    }

    if (data.endDate !== undefined || data.isCurrent !== undefined) {
      const current = data.isCurrent !== undefined ? Boolean(data.isCurrent) : existing.isCurrent;
      updatePayload.endDate = current ? null : cleanString(data.endDate);
    }

    if (data.location !== undefined) {
      updatePayload.location = cleanString(data.location);
    }

    if (data.description !== undefined) {
      updatePayload.description = cleanString(data.description);
    }

    if (data.technologies !== undefined) {
      updatePayload.technologies = Array.isArray(data.technologies)
        ? data.technologies.map((t) => String(t).trim()).filter(Boolean)
        : [];
    }

    if (data.order !== undefined) {
      updatePayload.order = Number(data.order) || 0;
    }

    const updated = await experienceRepository.updateById(id, updatePayload);
    return ExperienceMapper.toResponse(updated);
  },

  async deleteById(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await experienceRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Experience with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this experience",
      );
    }

    await experienceRepository.deleteById(id);

    return {
      success: true,
      message: "Experience deleted successfully",
    };
  },
};
