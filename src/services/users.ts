import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import getUserProfileByIDQuery from "@/graphql/queries/getUserProfileByID.query.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";
import useToast from "@/composables/useToast";
import checkID from "@/utils/checkID";
import {
  NOT_FOUND_USER,
  GRAPHQL_NULL_RETURN_ERROR,
} from "@/constants/errorMessage";

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

export const getUserProfileByID = async (id: string) => {
  try {
    checkID(id);

    const response = await apolloClient.query({
      query: getUserProfileByIDQuery,
      variables: { userId: Number(id) },
    });

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const { setErrorToast } = useToast();

      if (error.message.startsWith(GRAPHQL_NULL_RETURN_ERROR)) {
        const notFoundError = new Error(NOT_FOUND_USER);
        notFoundError.name = "NotFoundError";

        setErrorToast(notFoundError.message);

        throw notFoundError;
      } else {
        setErrorToast(error.message);
      }
    }

    throw error;
  }
};
