import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import getUserProfileByIDQuery from "@/graphql/queries/getUserProfileByID.query.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";
import { IUsersProfileServerData } from "@/types/userProfileUI";

export const getAllUsers = async () => {
  const result: IUsersTableData[] = [];

  try {
    const { users } = (
      await apolloClient.query({
        query: getAllUsersQuery,
      })
    ).data;

    if (!users) return;

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      // set some toast
      console.log(error.message);
    }
  }

  return result;
};

export const getUserProfileByID = async (id: number) => {
  try {
    const response = (await apolloClient.query({
      query: getUserProfileByIDQuery,
      variables: { userId: id },
    })) as { data: { user: IUsersProfileServerData } };

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // set some toast here

      if (
        error.message.startsWith("Cannot return null for non-nullable field")
      ) {
        const notFoundError = new Error(
          "The user with specified ID was not found!"
        );
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      }
    }

    throw error;
  }
};
