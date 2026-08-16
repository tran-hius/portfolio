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

export const ExperienceService = {
  async create(
    userId: string,
    data: CreateExperienceDTO,
  ): Promise<ExperienceResponseDTO> {
    if (!data.company || !data.company.trim()) {
      throw new BadRequestError("Company name is required");
    }
    if (!data.position || !data.position.trim()) {
      throw new BadRequestError("Position is required");
    }
    if (!data.startDate) {
      throw new BadRequestError("Start date is required");
    }

    const newExp = await experienceRepository.create({
      ...data,
      company: data.company.trim(),
      position: data.position.trim(),
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

    const updated = await experienceRepository.updateById(id, data);
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
