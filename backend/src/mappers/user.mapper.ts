import type { UserResponseDTO } from "../dtos/user-response.dto.js";

export class UserMapper {
  /**
   * Transforms a User mongoose document or raw object into a UserResponseDTO
   */
  static toResponse(user: any): UserResponseDTO {
    if (!user) return null as any;

    const raw = typeof user.toObject === "function" ? user.toObject() : user;
    const { password, __v, ...rest } = raw;

    return {
      _id: rest._id?.toString() || "",
      firstName: rest.firstName,
      lastName: rest.lastName,
      birthDay: rest.birthDay,
      nation: rest.nation,
      email: rest.email,
      phoneNumber: rest.phoneNumber,
      sex: rest.sex,
      address: rest.address,
      language: rest.language || [],
      socialUrl: rest.socialUrl || [],
      role: rest.role,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  /**
   * Transforms a list of users into UserResponseDTO array
   */
  static toResponseList(users: any[]): UserResponseDTO[] {
    if (!Array.isArray(users)) return [];
    return users.map((u) => this.toResponse(u));
  }
}
