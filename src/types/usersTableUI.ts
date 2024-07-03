export interface IUsersTableData {
  id: number;
  email: string;
  avatar: string | null;
  first_name: string | null;
  last_name: string | null;
  department_name: string | null;
  position_name: string | null;
}

export interface IUsersTableServerData {
  id: number;
  email: string;
  profile: {
    avatar: string | null;
    first_name: string | null;
    last_name: string | null;
  };
  department_name: string | null;
  position_name: string | null;
}
