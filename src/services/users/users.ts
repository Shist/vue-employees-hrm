import apolloClient from "@/plugins/apolloConfig";
import getAllUsersQuery from "@/graphql/users/getAllUsers.query.gql";
import getUserAuthDataByIdQuery from "@/graphql/users/getUserAuthDataById.query.gql";
import getUserFullnameByIdQuery from "@/graphql/users/getUserFullnameById.query.gql";
import { checkUserId, getDetailedError } from "@/utils/handleErrors";
import { IUsersTableServerData } from "@/types/pages/users/table";
import { IUsersNameServerData } from "@/types/navigation";
import { IUserAuthServerData } from "@/types/authData";

export const getAllUsers = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllUsersQuery,
    })) as { data: { users: IUsersTableServerData[] } };

    return response.data.users;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getUserAuthDataById = async (id: string) => {
  try {
    checkUserId(id);

    const response = (await apolloClient.query({
      query: getUserAuthDataByIdQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUserAuthServerData } };

    return response.data.user;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getUserNameDataById = async (id: string) => {
  try {
    checkUserId(id);

    const response = (await apolloClient.query({
      query: getUserFullnameByIdQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUsersNameServerData } };

    return response.data.user;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
