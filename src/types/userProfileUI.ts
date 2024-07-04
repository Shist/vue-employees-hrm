export interface IUsersProfileData {
  email: string;
  createdAt: number;
  isVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  departmentID: number;
  positionID: number;
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
