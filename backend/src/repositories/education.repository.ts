import { EducationModel } from "../schema/education.schema.js";
import type { CreateEducationDTO } from "../dtos/create-education.dto.js";
import type { UpdateEducationDTO } from "../dtos/update-education.dto.js";

export const educationRepository = {
  async create(data: CreateEducationDTO & { userId: string }) {
    return await EducationModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { order: 1, startDate: -1 },
  ) {
    return await EducationModel.find(filter).sort(sort).exec();
  },

  async findById(id: string) {
    return await EducationModel.findById(id);
  },

  async updateById(id: string, data: UpdateEducationDTO) {
    return await EducationModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await EducationModel.findByIdAndDelete(id);
  },
};
