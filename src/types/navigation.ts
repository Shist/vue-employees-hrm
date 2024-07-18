export interface INavigationItem {
  title: string;
  icon: string;
  link: string;
}

export interface IBreadCrumbsItem {
  crumbNum: number;
  title: string;
  disabled: boolean;
  to: {
    path: string;
  };
  crumbIconName?: string;
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
