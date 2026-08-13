
import { userRepository } from "../repositories/user.repository.js";

export const UserService = {
  async findByEmail(email: string) {
    return userRepository.findByEmail(email);
  }
};
