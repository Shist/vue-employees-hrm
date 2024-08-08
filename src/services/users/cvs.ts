import apolloClient from "@/plugins/apolloConfig";
import getUserCvsNamesByIdQuery from "@/graphql/users/cvs/getUserCvsNamesById.query.gql";
import { checkUserId, getDetailedError } from "@/utils/handleErrors";
import { IUserCvNameData } from "@/types/pages/users/cvs";

export const getUserCvsNamesById = async (id: string) => {
  try {
    checkUserId(id);

    const response = (await apolloClient.query({
      query: getUserCvsNamesByIdQuery,
      variables: { userId: Number(id) },
    })) as {
      data: { user: { cvs: IUserCvNameData[] } };
    };

    return response.data.user.cvs;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
