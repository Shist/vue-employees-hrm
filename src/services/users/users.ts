import apolloClient from "@/plugins/apolloConfig";
import getAllUsersQuery from "@/graphql/users/getAllUsers.query.gql";
import getUserAuthDataByIDQuery from "@/graphql/users/getUserAuthDataByID.query.gql";
import getUserFullnameByIDQuery from "@/graphql/users/getUserFullnameByID.query.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";
import { IUsersNameServerData } from "@/types/breadcrumbsUI";
import { IUserAuthServerData } from "@/types/userAuthUI";
import { checkUserID, getDetailedError } from "@/utils/handleErrors";

export const getAllUsers = async () => {
  const result: IUsersTableData[] = [];

  try {
    const response = (await apolloClient.query({
      query: getAllUsersQuery,
    })) as { data: { users: IUsersTableServerData[] } };

    response.data.users.forEach((user: IUsersTableServerData) => {
      result.push({
        id: user.id,
        email: user.email,
        avatar: user.profile.avatar,
        firstName: user.profile.first_name,
        lastName: user.profile.last_name,
        departmentName: user.department_name,
        positionName: user.position_name,
      });
    });
  } catch (error: unknown) {
    throw getDetailedError(error);
  }

  return result;
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
