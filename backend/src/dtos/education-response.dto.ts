export interface EducationResponseDTO {
  _id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  isCurrent: boolean;
  grade: string | null;
  description: string | null;
  order: number;
  createdAt?: Date | string | undefined;
  updatedAt?: Date | string | undefined;
}
