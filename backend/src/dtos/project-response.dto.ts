export interface ProjectResponseDTO {
  _id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail: string | null;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  isFeatured: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
