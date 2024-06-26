export default interface IBreadCrumbsItem {
  crumbNum: number;
  title: string;
  disabled: boolean;
  to: {
    path: string;
  };
}
