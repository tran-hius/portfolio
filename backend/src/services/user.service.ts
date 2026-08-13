import type { UpdateUserDTO } from "../dtos/update-user-dto.js";
import { userRepository } from "../repositories/user.repository.js";
import createHttpError from "http-errors";

export const UserService = {
  async findById(id: string) {
    return userRepository.findById(id);
  },

  async findByEmail(email: string) {
    return userRepository.findByEmail(email);
  },

  async updateById(id: string, data: UpdateUserDTO) {
    const user = await this.findById(id);

    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    return userRepository.updateById(id, data);
  },

  async deleteById(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    return userRepository.deleteById(id);
  },

  async getMe(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    const { password, ...userResponse } = user.toObject();

    return {
      ...userResponse,
      _id: userResponse._id.toString(),
    };
  },
};
