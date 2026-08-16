export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  role?: string | undefined;
}
