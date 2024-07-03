import {
  IProfile,
  ICreateProfileInput,
} from "@/types/backend-interfaces/user/profile";
import { ICV } from "@/types/backend-interfaces/cv";
import { IDepartment } from "@/types/backend-interfaces/department";
import { IPosition } from "@/types/backend-interfaces/position";
import { IAuthInput } from "@/types/backend-interfaces/user/auth";

export enum UserRole {
  Employee,
  Admin,
}

export interface IUser {
  id: number;
  created_at: string;
  email: string;
  is_verified: boolean;
  profile: IProfile;
  cvs?: ICV[];
  department?: IDepartment;
  department_name?: string;
  position?: IPosition;
  position_name?: string;
  role: UserRole;
}

export interface ICreateUserInput {
  auth: IAuthInput;
  profile: ICreateProfileInput;
  cvsIds: string[];
  departmentId?: number;
  positionId?: number;
  role: UserRole;
}

export interface IUpdateUserInput {
  userId: number;
  cvsIds?: string[];
  departmentId?: number;
  positionId?: number;
  role?: UserRole;
}
