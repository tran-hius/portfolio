import type { EducationResponseDTO } from "../dtos/education-response.dto.js";

export class EducationMapper {
  static toResponse(education: any): EducationResponseDTO {
    if (!education) return null as any;

    const raw =
      typeof education.toObject === "function"
        ? education.toObject()
        : education;
    const { __v, ...rest } = raw;

    return {
      _id: rest._id?.toString() || "",
      userId: rest.userId ? rest.userId.toString() : "",
      institution: rest.institution,
      degree: rest.degree,
      fieldOfStudy: rest.fieldOfStudy ?? null,
      startDate: rest.startDate,
      endDate: rest.endDate ?? null,
      isCurrent: Boolean(rest.isCurrent),
      grade: rest.grade ?? null,
      description: rest.description ?? null,
      order: typeof rest.order === "number" ? rest.order : 0,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  static toResponseList(educations: any[]): EducationResponseDTO[] {
    if (!Array.isArray(educations)) return [];
    return educations.map((edu) => this.toResponse(edu));
  }
}
