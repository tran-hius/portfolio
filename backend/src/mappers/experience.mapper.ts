import type { ExperienceResponseDTO } from "../dtos/experience-response.dto.js";

export class ExperienceMapper {
  static toResponse(experience: any): ExperienceResponseDTO {
    if (!experience) return null as any;

    const raw =
      typeof experience.toObject === "function"
        ? experience.toObject()
        : experience;
    const { __v, ...rest } = raw;

    return {
      _id: rest._id?.toString() || "",
      userId: rest.userId ? rest.userId.toString() : "",
      company: rest.company,
      position: rest.position,
      location: rest.location ?? null,
      startDate: rest.startDate,
      endDate: rest.endDate ?? null,
      isCurrent: Boolean(rest.isCurrent),
      description: rest.description ?? null,
      technologies: Array.isArray(rest.technologies) ? rest.technologies : [],
      order: typeof rest.order === "number" ? rest.order : 0,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  static toResponseList(experiences: any[]): ExperienceResponseDTO[] {
    if (!Array.isArray(experiences)) return [];
    return experiences.map((exp) => this.toResponse(exp));
  }
}
