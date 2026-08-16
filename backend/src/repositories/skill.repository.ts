import { SkillModel } from "../schema/skill.schema.js";
import type { CreateSkillDTO } from "../dtos/create-skill.dto.js";
import type { UpdateSkillDTO } from "../dtos/update-skill.dto.js";

export const skillRepository = {
  async create(data: CreateSkillDTO & { userId: string }) {
    return await SkillModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { category: 1, order: 1, createdAt: -1 },
  ) {
    return await SkillModel.find(filter).sort(sort).exec();
  },

  async findById(id: string) {
    return await SkillModel.findById(id);
  },

  async updateById(id: string, data: UpdateSkillDTO) {
    return await SkillModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await SkillModel.findByIdAndDelete(id);
  },

  async findByUserId(userId: string) {
    return await SkillModel.find({ userId }).sort({ category: 1, order: 1 });
  },
};
