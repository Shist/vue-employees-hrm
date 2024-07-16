import apolloClient from "@/plugins/apolloConfig";
import getAllUsersQuery from "@/graphql/users/getAllUsers.query.gql";
import getUserAuthDataByIDQuery from "@/graphql/users/getUserAuthDataByID.query.gql";
import getUserFullnameByIDQuery from "@/graphql/users/getUserFullnameByID.query.gql";
import { checkUserID, getDetailedError } from "@/utils/handleErrors";
import { IUsersTableServerData } from "@/types/usersTableUI";
import { IUsersNameServerData } from "@/types/breadcrumbsUI";
import { IUserAuthServerData } from "@/types/userAuthUI";

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

export const getUserAuthDataByID = async (id: string) => {
  try {
    checkUserID(id);

    const response = (await apolloClient.query({
      query: getUserAuthDataByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUserAuthServerData } };

    return response.data.user;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getUserNameDataByID = async (id: string) => {
  try {
    checkUserID(id);

    const response = (await apolloClient.query({
      query: getUserFullnameByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUsersNameServerData } };

    return response.data.user;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
