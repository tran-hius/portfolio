import { TokenService } from "./token.service.js";
import { UserService } from "./user.service.js";
import { HashUtil } from "../utils/hash.util.js";
import { UserMapper } from "../mappers/user.mapper.js";
import type { CreateUserDTO } from "../dtos/create-user-dto.js";
import { userRepository } from "../repositories/user.repository.js";
import type { LoginDTO } from "../dtos/login-dto.js";
import type { LoginResponseDTO } from "../dtos/login-response-dto.js";
import { ConflictError, UnauthorizedError } from "../errors/app.error.js";

export const AuthService = {
  async create(data: CreateUserDTO) {
    const { email, password } = data;

    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new ConflictError("Account already exists");
    }

    const hashedPassword = await HashUtil.hash(password);

    const newUser = {
      ...data,
      email,
      password: hashedPassword,
    };

    const user = await userRepository.create(newUser);

    const { accessToken } = TokenService.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: UserMapper.toResponse(user),
      accessToken,
    };
  },

  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    const { email, password } = data;

    const user = await UserService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await HashUtil.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const { accessToken } = TokenService.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: UserMapper.toResponse(user),
      accessToken,
    };
  },
};
