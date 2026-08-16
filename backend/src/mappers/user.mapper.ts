import type { UserResponseDTO } from "../dtos/user-response.dto.js";

export class UserMapper {
  static toResponse(user: any): UserResponseDTO {
    if (!user) return null as any;

    const raw = typeof user.toObject === "function" ? user.toObject() : user;
    const { password, __v, ...rest } = raw;

    const nameParts = [rest.firstName, rest.lastName].filter(Boolean);
    const fullName = nameParts.length > 0 ? nameParts.join(" ") : "Master Admin";

    return {
      _id: rest._id?.toString() || "",
      id: rest._id?.toString() || "",
      firstName: rest.firstName || "",
      lastName: rest.lastName || "",
      name: fullName,
      birthDay: rest.birthDay,
      nation: rest.nation,
      email: rest.email,
      phoneNumber: rest.phoneNumber,
      sex: rest.sex,
      address: rest.address,
      language: rest.language || [],
      socialUrl: rest.socialUrl || [],
      role: rest.role || "admin",
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  static toResponseList(users: any[]): UserResponseDTO[] {
    if (!Array.isArray(users)) return [];
    return users.map((u) => this.toResponse(u));
  }
}
