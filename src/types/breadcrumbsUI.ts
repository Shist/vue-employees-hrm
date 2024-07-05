export interface IUserNameData {
  email: string;
  fullName: string | null;
}

export interface IUsersNameServerData {
  email: string;
  profile: {
    full_name: string | null;
  };
}
