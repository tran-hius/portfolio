export interface UserResponse {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  birthDay?: Date | null;
  nation?: string | null;
  email: string;
  phoneNumber?: string | null;
  sex?: string | null;
  address?: string | null;
  language?: string[] | null;
  socialUrl?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}
