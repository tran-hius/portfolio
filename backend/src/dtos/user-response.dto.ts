export interface UserResponseDTO {
  _id: string;
  firstName?: string;
  lastName?: string;
  birthDay?: Date | string;
  nation?: string;
  email: string;
  phoneNumber?: string;
  sex?: string;
  address?: string;
  language?: string[];
  socialUrl?: string[];
  role: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
