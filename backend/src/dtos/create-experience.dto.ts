export interface CreateExperienceDTO {
  company: string;
  position: string;
  location?: string | null | undefined;
  startDate: string | Date;
  endDate?: string | Date | null | undefined;
  isCurrent?: boolean | undefined;
  description?: string | null | undefined;
  technologies?: string[] | undefined;
  order?: number | undefined;
}
