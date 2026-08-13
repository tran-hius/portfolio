import type { UserResponse } from "./user-response-dto.js";

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
}
