export default interface IUserApolloData {
  id: number;
  email: string;
  profile: {
    avatar: string | null;
    first_name: string | null;
    last_name: string | null;
  };
  department: {
    name: string | null;
  };
  position: {
    name: string | null;
  };
}
