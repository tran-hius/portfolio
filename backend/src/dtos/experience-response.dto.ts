export interface ExperienceResponseDTO {
  _id: string;
  userId: string;
  company: string;
  position: string;
  location: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  isCurrent: boolean;
  description: string | null;
  technologies: string[];
  order: number;
  createdAt?: Date | string | undefined;
  updatedAt?: Date | string | undefined;
}
