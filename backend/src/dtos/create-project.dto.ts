export interface CreateProjectDTO {
  title: string;
  description: string;
  thumbnail?: string | null;
  technologies?: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isFeatured?: boolean;
}
