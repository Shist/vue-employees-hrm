import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import getUserProfileByIDQuery from "@/graphql/queries/getUserProfileByID.query.gql";
import getUserFullnameByIDQuery from "@/graphql/queries/getUserFullnameByID.query.gql";
import updateUserQuery from "@/graphql/mutations/updateUser.mutation.gql";
import updateProfileQuery from "@/graphql/mutations/updateProfile.mutation.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";
import { IUserProfileServerData } from "@/types/userProfileUI";
import { IUsersNameServerData } from "@/types/breadcrumbsUI";
import { IUpdateUserInput } from "@/types/backend-interfaces/user";
import { IUpdateProfileInput } from "@/types/backend-interfaces/user/profile";
import checkID from "@/utils/checkID";
import {
  NOT_FOUND_USER,
  GRAPHQL_NULL_RETURN_ERROR,
  NO_NETWORK_CONNECTION,
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

export const getUserNameDataByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserFullnameByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUsersNameServerData } };

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};

export const getUserProfileByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserProfileByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUserProfileServerData } };

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith(GRAPHQL_NULL_RETURN_ERROR)) {
        const notFoundError = new Error(NOT_FOUND_USER);
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const updateUserData = async (
  inputUserObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
  inputProfileObj: IUpdateProfileInput
) => {
  try {
    await apolloClient.mutate({
      mutation: updateProfileQuery,
      variables: { profile: inputProfileObj },
    });

    const response = (await apolloClient.mutate({
      mutation: updateUserQuery,
      variables: { user: inputUserObj },
    })) as { data: { updateUser: IUserProfileServerData } };

    return response.data.updateUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};
