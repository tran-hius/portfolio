export interface UpdateEducationDTO {
  institution?: string | undefined;
  degree?: string | undefined;
  fieldOfStudy?: string | null | undefined;
  startDate?: string | Date | undefined;
  endDate?: string | Date | null | undefined;
  isCurrent?: boolean | undefined;
  grade?: string | null | undefined;
  description?: string | null | undefined;
  order?: number | undefined;
}
