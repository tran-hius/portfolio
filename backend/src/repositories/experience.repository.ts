import { ExperienceModel } from "../schema/experience.schema.js";
import type { CreateExperienceDTO } from "../dtos/create-experience.dto.js";
import type { UpdateExperienceDTO } from "../dtos/update-experience.dto.js";

export const experienceRepository = {
  async create(data: CreateExperienceDTO & { userId: string }) {
    return await ExperienceModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { order: 1, startDate: -1 },
  ) {
    return await ExperienceModel.find(filter).sort(sort).exec();
  },

  async findById(id: string) {
    return await ExperienceModel.findById(id);
  },

  async updateById(id: string, data: UpdateExperienceDTO) {
    return await ExperienceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await ExperienceModel.findByIdAndDelete(id);
  },
};
