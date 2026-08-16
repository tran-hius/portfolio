export interface CreateEducationDTO {
  institution: string;
  degree: string;
  fieldOfStudy?: string | null | undefined;
  startDate: string | Date;
  endDate?: string | Date | null | undefined;
  isCurrent?: boolean | undefined;
  grade?: string | null | undefined;
  description?: string | null | undefined;
  order?: number | undefined;
}
