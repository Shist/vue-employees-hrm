export interface IUsersProfileData {
  email: string | "pending" | "error";
  createdAt: number | "pending" | "error";
  isVerified: boolean | "pending" | "error";
  firstName: string | null | "pending" | "error";
  lastName: string | null | "pending" | "error";
  avatar: string | null | "pending" | "error";
  departmentID: number | "pending" | "error";
  positionID: number | "pending" | "error";
}

export interface IUsersProfileServerData {
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
  };
  position: {
    id: string;
  };
}
