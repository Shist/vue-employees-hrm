import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";

export const getAllUsers = async () => {
  const result: IUsersTableData[] = [];

  try {
    const databaseResult = await apolloClient.query({
      query: getAllUsersQuery,
    });

    if (databaseResult.data.users) {
      const users = databaseResult.data.users;

      users.forEach((user: IUsersTableServerData) => {
        result.push({
          id: user.id,
          email: user.email,
          avatar: user.profile.avatar ?? "",
          first_name: user.profile?.first_name ?? "",
          last_name: user.profile?.last_name ?? "",
          department_name: user.department_name ?? "",
          position_name: user.position_name ?? "",
        });
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return result;
};
