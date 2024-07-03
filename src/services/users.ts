import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import IUserData from "@/types/IUserData";
import IUserApolloData from "@/types/IUserApolloData";
import { useAuthStore } from "@/store/authStore";

export const getAllUsers = async () => {
  const result: IUserData[] = [];

  try {
    const { users } = (
      await apolloClient.query({
        query: getAllUsersQuery,
      })
    ).data;

    if (!users) return;

    users.forEach((user: IUserApolloData) => {
      result.push({
        id: user.id,
        email: user.email,
        avatar: user.profile.avatar ?? "",
        firstName: user.profile?.first_name ?? "",
        lastName: user.profile?.last_name ?? "",
        department: user.department?.name ?? "",
        position: user.position?.name ?? "",
        skills: [],
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      if (error.message === "Unauthorized") {
        useAuthStore().checkTokenExpiration();
      }
    }
  }
  return result;
};
