export interface CreateSkillDTO {
  name: string;
  category: string;
  proficiency?: number | null | undefined;
  icon?: string | null | undefined;
  color?: string | null | undefined;
  order?: number | undefined;
  isFeatured?: boolean | undefined;
}
