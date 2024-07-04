import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import getUserProfileByIDQuery from "@/graphql/queries/getUserProfileByID.query.gql";
import { useAuthStore } from "@/store/authStore";
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
      if (error.message === "Unauthorized") {
        useAuthStore().checkTokenExpiration();
      }
    }
  }

  return result;
};

export const getUserProfileByID = async (id: number) => {
  let result: IUsersProfileServerData | "pending" | "error" = "pending";

  try {
    const { user } = (
      await apolloClient.query({
        query: getUserProfileByIDQuery,
        variables: { userId: id },
      })
    ).data as { user: IUsersProfileServerData };

    result = user;
  } catch (error: unknown) {
    result = "error";

    // Show some toast that we didn't load user

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        useAuthStore().checkTokenExpiration();
      }
    }
  }

  return result;
};
