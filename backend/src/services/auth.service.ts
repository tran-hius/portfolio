import { TokenService } from "./token.service.js";
import { UserService } from "./user.service.js";
import bcrypt from "bcrypt";
import type { CreateUserDTO } from "../dtos/create-user-dto.js";
import type { UserResponse } from "../dtos/user-response-dto.js";
import { userRepository } from "../repositories/user.repository.js";
import type { LoginDTO } from "../dtos/login-dto.js";
import type { LoginResponse } from "../dtos/login-response.js";

export const AuthService = {
  async create(data: CreateUserDTO): Promise<UserResponse> {
    const { email, password } = data;
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new Error("Account exists");
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

  async login(data: LoginDTO): Promise<LoginResponse> {
    const { email, password } = data;

    const user = await UserService.findByEmail(email);

    if (!user) {
      throw new Error("Invalid user");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new Error("Invalid password");
    }

    const { accessToken, refreshToken } = TokenService.generateToken({
      userId: user._id.toString(),
      email: user.email,
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
