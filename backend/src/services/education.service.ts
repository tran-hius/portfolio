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

const cleanString = (val?: any): string | null => {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
};

export const EducationService = {
  async create(
    userId: string,
    data: CreateEducationDTO,
  ): Promise<EducationResponseDTO> {
    const institution = cleanString(data.institution);
    const degree = cleanString(data.degree);
    const startDate = cleanString(data.startDate);

    if (!institution) {
      throw new BadRequestError("Institution name is required");
    }
    if (!degree) {
      throw new BadRequestError("Degree is required");
    }
    if (!startDate) {
      throw new BadRequestError("Start date is required");
    }

    const isCurrent = Boolean(data.isCurrent);
    const endDate = isCurrent ? null : cleanString(data.endDate);
    const fieldOfStudy = cleanString(data.fieldOfStudy);
    const grade = cleanString(data.grade);
    const description = cleanString(data.description);

    const newEdu = await educationRepository.create({
      institution,
      degree,
      startDate,
      endDate,
      isCurrent,
      fieldOfStudy,
      grade,
      description,
      order: typeof data.order === "number" ? data.order : 0,
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

    const updatePayload: Record<string, any> = {};

    if (data.institution !== undefined) {
      const institution = cleanString(data.institution);
      if (!institution) throw new BadRequestError("Institution name cannot be empty");
      updatePayload.institution = institution;
    }

    if (data.degree !== undefined) {
      const degree = cleanString(data.degree);
      if (!degree) throw new BadRequestError("Degree cannot be empty");
      updatePayload.degree = degree;
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

    if (data.fieldOfStudy !== undefined) {
      updatePayload.fieldOfStudy = cleanString(data.fieldOfStudy);
    }

    if (data.grade !== undefined) {
      updatePayload.grade = cleanString(data.grade);
    }

    if (data.description !== undefined) {
      updatePayload.description = cleanString(data.description);
    }

    if (data.order !== undefined) {
      updatePayload.order = Number(data.order) || 0;
    }

    const updated = await educationRepository.updateById(id, updatePayload);
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
