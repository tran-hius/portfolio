export interface UpdateExperienceDTO {
  company?: string | undefined;
  position?: string | undefined;
  location?: string | null | undefined;
  startDate?: string | Date | undefined;
  endDate?: string | Date | null | undefined;
  isCurrent?: boolean | undefined;
  description?: string | null | undefined;
  technologies?: string[] | undefined;
  order?: number | undefined;
}
