import { User } from '../users/schemas/user.schema';

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface JwtPayload {
  email: string;
  sub: string;
}
