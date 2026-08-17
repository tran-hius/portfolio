export interface ProjectResponseDTO {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string | null;
  thumbnail: string | null;
  imageUrl: string | null;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  liveUrl: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  isFeatured: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
