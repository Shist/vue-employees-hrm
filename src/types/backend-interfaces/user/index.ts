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
  cvs: ICV[] | null;
  department: IDepartment | null;
  department_name: string | null;
  position: IPosition | null;
  position_name: string | null;
  role: UserRole;
}

export interface ICreateUserInput {
  auth: IAuthInput;
  profile: ICreateProfileInput;
  cvsIds: string[];
  departmentId: number | null;
  positionId: number | null;
  role: UserRole;
}

export interface IUpdateUserInput {
  userId: number;
  cvsIds: string[] | null;
  departmentId: number | null;
  positionId: number | null;
  role: UserRole | null;
}
