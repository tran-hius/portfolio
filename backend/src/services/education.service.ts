import { educationRepository } from "../repositories/education.repository.js";
import { EducationMapper } from "../mappers/education.mapper.js";
import type { CreateEducationDTO } from "../dtos/create-education.dto.js";
import type { UpdateEducationDTO } from "../dtos/update-education.dto.js";
import type { EducationResponseDTO } from "../dtos/education-response.dto.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../errors/app.error.js";

export interface EducationFilter {
  isCurrent?: boolean | undefined;
  search?: string | undefined;
}

const escapeRegex = (str: string): string => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const EducationService = {
  async create(
    userId: string,
    data: CreateEducationDTO,
  ): Promise<EducationResponseDTO> {
    if (!data.institution || !data.institution.trim()) {
      throw new BadRequestError("Institution name is required");
    }
    if (!data.degree || !data.degree.trim()) {
      throw new BadRequestError("Degree is required");
    }
    if (!data.startDate) {
      throw new BadRequestError("Start date is required");
    }

    const newEdu = await educationRepository.create({
      ...data,
      institution: data.institution.trim(),
      degree: data.degree.trim(),
      userId,
    });

    return EducationMapper.toResponse(newEdu);
  },

  async findAll(
    filter: EducationFilter = {},
  ): Promise<EducationResponseDTO[]> {
    const mongoFilter: Record<string, any> = {};

    if (typeof filter.isCurrent === "boolean") {
      mongoFilter.isCurrent = filter.isCurrent;
    }

    if (filter.search) {
      const safeSearch = escapeRegex(filter.search);
      mongoFilter.$or = [
        { institution: { $regex: safeSearch, $options: "i" } },
        { degree: { $regex: safeSearch, $options: "i" } },
        { fieldOfStudy: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const educations = await educationRepository.findAll(mongoFilter);
    return EducationMapper.toResponseList(educations);
  },

  async findById(id: string): Promise<EducationResponseDTO> {
    const education = await educationRepository.findById(id);

    if (!education) {
      throw new NotFoundError(`Education with id ${id} not found`);
    }

    return EducationMapper.toResponse(education);
  },

  async updateById(
    id: string,
    userId: string,
    data: UpdateEducationDTO,
  ): Promise<EducationResponseDTO> {
    const existing = await educationRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Education with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this education record",
      );
    }

    const updated = await educationRepository.updateById(id, data);
    return EducationMapper.toResponse(updated);
  },

  async deleteById(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await educationRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Education with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this education record",
      );
    }

    await educationRepository.deleteById(id);

    return {
      success: true,
      message: "Education record deleted successfully",
    };
  },
};
