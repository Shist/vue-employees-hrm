export interface IUserNameData {
  email: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface IUsersNameServerData {
  email: string;
  profile: {
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

export interface ICvNameData {
  name: string;
}
