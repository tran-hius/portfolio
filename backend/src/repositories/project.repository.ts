import { ProjectModel } from "../schema/project.schema.js";
import type { CreateProjectDTO } from "../dtos/create-project.dto.js";
import type { UpdateProjectDTO } from "../dtos/update-project.dto.js";

export const projectRepository = {
  async create(data: CreateProjectDTO & { userId: string }) {
    return await ProjectModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 },
  ) {
    return await ProjectModel.find(filter).sort(sort);
  },

  async findById(id: string) {
    return await ProjectModel.findById(id);
  },

  async updateById(id: string, data: UpdateProjectDTO) {
    return await ProjectModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await ProjectModel.findByIdAndDelete(id);
  },

  async findByUserId(userId: string) {
    return await ProjectModel.find({ userId }).sort({ createdAt: -1 });
  },
};

