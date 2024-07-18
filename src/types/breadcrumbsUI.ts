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
