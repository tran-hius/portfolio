import type { UpdateUserDTO } from "../dtos/update-user-dto.js";
import { userRepository } from "../repositories/user.repository.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { NotFoundError } from "../errors/app.error.js";
import type { UserResponseDTO } from "../dtos/user-response.dto.js";

export const UserService = {
  async findById(id: string) {
    return userRepository.findById(id);
  },

  async findByEmail(email: string) {
    return userRepository.findByEmail(email);
  },

  async updateById(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updated = await userRepository.updateById(id, data);
    return UserMapper.toResponse(updated);
  },

  async deleteById(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await userRepository.deleteById(id);
    return {
      success: true,
      message: "User deleted successfully",
    };
  },

  async getMe(id: string): Promise<UserResponseDTO> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return UserMapper.toResponse(user);
  },
};
