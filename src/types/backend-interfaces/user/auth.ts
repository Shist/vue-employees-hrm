import { IUser } from "@/types/backend-interfaces/user";

export interface IAuthInput {
  email: string;
  password: string;
}

export interface IAuthResult {
  user: IUser;
  access_token: string;
}
