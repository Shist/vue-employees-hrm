import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";

export const getAllUsers = async () => {
  const result: IUsersTableData[] = [];

  try {
    const { users } = (
      await apolloClient.query({
        query: getAllUsersQuery,
      })
    ).data;

    users.forEach((user: IUsersTableServerData) => {
      result.push({
        id: user.id,
        email: user.email,
        avatar: user.profile.avatar ?? "",
        firstName: user.profile?.first_name ?? "",
        lastName: user.profile?.last_name ?? "",
        departmentName: user.department_name ?? "",
        positionName: user.position_name ?? "",
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return result;
};
