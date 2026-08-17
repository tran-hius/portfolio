export interface UpdateSkillDTO {
  name?: string | undefined;
  category?: string | undefined;
  proficiency?: number | null | undefined;
  icon?: string | null | undefined;
  color?: string | null | undefined;
  order?: number | undefined;
  isFeatured?: boolean | undefined;
}
