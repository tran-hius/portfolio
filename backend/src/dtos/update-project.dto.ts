export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  category?: string;
  thumbnail?: string | null;
  imageUrl?: string | null;
  technologies?: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  liveUrl?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isFeatured?: boolean;
}
