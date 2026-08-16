import { skillRepository } from "../repositories/skill.repository.js";
import { SkillMapper } from "../mappers/skill.mapper.js";
import type { CreateSkillDTO } from "../dtos/create-skill.dto.js";
import type { UpdateSkillDTO } from "../dtos/update-skill.dto.js";
import type { SkillResponseDTO } from "../dtos/skill-response.dto.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../errors/app.error.js";

export interface SkillFilter {
  category?: string | undefined;
  isFeatured?: boolean | undefined;
  search?: string | undefined;
  grouped?: boolean | undefined;
}

const escapeRegex = (str: string): string => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const SkillService = {
  async create(
    userId: string,
    data: CreateSkillDTO,
  ): Promise<SkillResponseDTO> {
    if (!data.name || !data.name.trim()) {
      throw new BadRequestError("Skill name is required");
    }
    if (!data.category || !data.category.trim()) {
      throw new BadRequestError("Skill category is required");
    }

    if (
      typeof data.proficiency === "number" &&
      (data.proficiency < 0 || data.proficiency > 100)
    ) {
      throw new BadRequestError("Proficiency must be between 0 and 100");
    }

    const newSkill = await skillRepository.create({
      ...data,
      name: data.name.trim(),
      category: data.category.trim(),
      userId,
    });

    return SkillMapper.toResponse(newSkill);
  },

  async findAll(
    filter: SkillFilter = {},
  ): Promise<SkillResponseDTO[] | Record<string, SkillResponseDTO[]>> {
    const mongoFilter: Record<string, any> = {};

    if (typeof filter.isFeatured === "boolean") {
      mongoFilter.isFeatured = filter.isFeatured;
    }

    if (filter.category) {
      const safeCat = escapeRegex(filter.category);
      mongoFilter.category = { $regex: new RegExp(`^${safeCat}$`, "i") };
    }

    if (filter.search) {
      const safeSearch = escapeRegex(filter.search);
      mongoFilter.name = { $regex: safeSearch, $options: "i" };
    }

    const skills = await skillRepository.findAll(mongoFilter);
    const mappedList = SkillMapper.toResponseList(skills);

    if (filter.grouped) {
      const grouped: Record<string, SkillResponseDTO[]> = {};
      for (const skill of mappedList) {
        const cat = skill.category;
        const list = grouped[cat] ?? [];
        list.push(skill);
        grouped[cat] = list;
      }
      return grouped;
    }

    return mappedList;
  },

  async findById(id: string): Promise<SkillResponseDTO> {
    const skill = await skillRepository.findById(id);

    if (!skill) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }

    return SkillMapper.toResponse(skill);
  },

  async updateById(
    id: string,
    userId: string,
    data: UpdateSkillDTO,
  ): Promise<SkillResponseDTO> {
    const existing = await skillRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this skill",
      );
    }

    if (
      typeof data.proficiency === "number" &&
      (data.proficiency < 0 || data.proficiency > 100)
    ) {
      throw new BadRequestError("Proficiency must be between 0 and 100");
    }

    const updated = await skillRepository.updateById(id, data);
    return SkillMapper.toResponse(updated);
  },

  async deleteById(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await skillRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this skill",
      );
    }

    await skillRepository.deleteById(id);

    return {
      success: true,
      message: "Skill deleted successfully",
    };
  },
};
