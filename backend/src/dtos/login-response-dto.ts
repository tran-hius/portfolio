import type { UserResponseDTO } from "./user-response.dto.js";

export interface LoginResponseDTO {
  user: UserResponseDTO;
  accessToken: string;
}
