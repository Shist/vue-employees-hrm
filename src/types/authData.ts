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
  role: "Employee" | "Admin";
  iat: number;
  exp: number;
}
