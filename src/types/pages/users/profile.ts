import { UserRole } from "@/types/enums";

export interface IUserProfileData {
  email: string;
  createdAt: number;
  isVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  departmentId: string | null;
  positionId: string | null;
}

export interface IUserProfileServerData {
  email: string;
  created_at: string;
  is_verified: boolean;
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
  };
  department: {
    id: string;
  } | null;
  position: {
    id: string;
  } | null;
}

export interface IDepartmentNamesData {
  id: number;
  name: string;
}

export interface IPositionNamesData {
  id: number;
  name: string;
}

export interface IUploadAvatarInput {
  userId: number;
  base64: string;
  size: number;
  type: string;
}

export interface IUpdateUserInput {
  userId: number;
  cvsIds: string[] | null;
  departmentId: number | null;
  positionId: number | null;
  role: UserRole | null;
}

export interface IUpdateProfileInput {
  userId: number;
  first_name: string | null;
  last_name: string | null;
}
