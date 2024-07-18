import apolloClient from "@/plugins/apolloConfig";
import getUserCVsNamesByIdQuery from "@/graphql/users/cvs/getUserCVsNamesById.query.gql";
import { checkUserId, getDetailedError } from "@/utils/handleErrors";
import { IUserCVNameData } from "@/types/userCVsUI";

export const getUserCVsNamesById = async (id: string) => {
  try {
    checkUserId(id);

    const response = (await apolloClient.query({
      query: getUserCVsNamesByIdQuery,
      variables: { userId: Number(id) },
    })) as {
      data: { user: { cvs: IUserCVNameData[] } };
    };

    return response.data.user.cvs;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
