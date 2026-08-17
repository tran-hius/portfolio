import type { ProjectResponseDTO } from "../dtos/project-response.dto.js";

export class ProjectMapper {
  
  static toResponse(project: any): ProjectResponseDTO {
    if (!project) return null as any;

    const raw =
      typeof project.toObject === "function" ? project.toObject() : project;
    const { __v, ...rest } = raw;

    const image = rest.imageUrl || rest.thumbnail || null;
    const live = rest.liveUrl || rest.demoUrl || null;

    return {
      _id: rest._id?.toString() || "",
      userId: rest.userId ? rest.userId.toString() : "",
      title: rest.title,
      description: rest.description,
      category: rest.category || "Architecture",
      thumbnail: image,
      imageUrl: image,
      technologies: Array.isArray(rest.technologies) ? rest.technologies : [],
      githubUrl: rest.githubUrl ?? null,
      demoUrl: live,
      liveUrl: live,
      startDate: rest.startDate ?? null,
      endDate: rest.endDate ?? null,
      isFeatured: Boolean(rest.isFeatured),
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  static toResponseList(projects: any[]): ProjectResponseDTO[] {
    if (!Array.isArray(projects)) return [];
    return projects.map((p) => this.toResponse(p));
  }
}
