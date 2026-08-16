import type { SkillResponseDTO } from "../dtos/skill-response.dto.js";

export class SkillMapper {
  /**
   * Transforms a Skill mongoose document or raw object into a SkillResponseDTO
   */
  static toResponse(skill: any): SkillResponseDTO {
    if (!skill) return null as any;

    const raw =
      typeof skill.toObject === "function" ? skill.toObject() : skill;
    const { __v, ...rest } = raw;

    return {
      _id: rest._id?.toString() || "",
      userId: rest.userId ? rest.userId.toString() : "",
      name: rest.name,
      category: rest.category,
      proficiency: rest.proficiency ?? null,
      icon: rest.icon ?? null,
      order: typeof rest.order === "number" ? rest.order : 0,
      isFeatured: Boolean(rest.isFeatured),
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  /**
   * Transforms a list of skills into SkillResponseDTO array
   */
  static toResponseList(skills: any[]): SkillResponseDTO[] {
    if (!Array.isArray(skills)) return [];
    return skills.map((s) => this.toResponse(s));
  }
}
