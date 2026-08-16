import { ProjectModel } from "../schema/project.schema.js";
import type { CreateProjectDTO } from "../dtos/create-project.dto.js";
import type { UpdateProjectDTO } from "../dtos/update-project.dto.js";

export const projectRepository = {
  async create(data: CreateProjectDTO & { userId: string }) {
    return await ProjectModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    options: {
      sort?: Record<string, 1 | -1>;
      skip?: number;
      limit?: number;
    } = {},
  ) {
    const { sort = { createdAt: -1 }, skip, limit } = options;
    let query = ProjectModel.find(filter).sort(sort);

    if (typeof skip === "number" && skip > 0) {
      query = query.skip(skip);
    }

    if (typeof limit === "number" && limit > 0) {
      query = query.limit(limit);
    }

    return await query.exec();
  },

  async count(filter: Record<string, any> = {}) {
    return await ProjectModel.countDocuments(filter);
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

