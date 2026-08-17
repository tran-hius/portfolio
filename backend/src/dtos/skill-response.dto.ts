export interface SkillResponseDTO {
  _id: string;
  userId: string;
  name: string;
  category: string;
  proficiency: number | null;
  icon: string | null;
  color?: string | null;
  order: number;
  isFeatured: boolean;
  createdAt?: Date | string | undefined;
  updatedAt?: Date | string | undefined;
}
