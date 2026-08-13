import { TokenService } from "./token.service.js";
import { UserService } from "./user.service.js";
import bcrypt from "bcrypt";
import type { CreateUserDTO } from "../dtos/create-user-dto.js";
import { userRepository } from "../repositories/user.repository.js";
import type { LoginDTO } from "../dtos/login-dto.js";
import type { LoginResponse } from "../dtos/login-response-dto.js";
import createHttpError from "http-errors";

export const AuthService = {
  async create(data: CreateUserDTO) {
    const { email, password } = data;

    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw createHttpError.Conflict("Account already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...data,
      email,
      password: hashedPassword,
    };

    const user = await userRepository.create(newUser);

    const { password: _, ...userResponse } = user.toObject();

    return {
      ...userResponse,
      _id: userResponse._id.toString(),
    };
  },

  async login(data: LoginDTO){
    const { email, password } = data;

    const user = await UserService.findByEmail(email);

    if (!user) {
      throw createHttpError.Unauthorized("Invalid credentials");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw createHttpError.Unauthorized("Invalid credentials");
    }

    const { accessToken } = TokenService.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const { password: _, _id, ...rest } = user;

    return {
      user: {
        ...rest,
        _id: _id.toString(),
      },
      accessToken,
    };
  },
};
