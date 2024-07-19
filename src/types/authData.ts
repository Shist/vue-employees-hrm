import { UserRole } from "@/types/enums";

export interface IAuthData {
  user: IUserAuthData;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthServerData {
  user: IUserAuthServerData;
  access_token: string;
  refresh_token: string;
}

export interface IUserAuthData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  avatar: string | null;
}

export interface IUserAuthServerData {
  id: string;
  email: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    avatar: string | null;
  };
}

export interface ITokenData {
  sub: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
