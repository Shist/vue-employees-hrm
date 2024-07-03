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
