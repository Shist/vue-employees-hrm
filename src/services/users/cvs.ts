import apolloClient from "@/plugins/apolloConfig";
import getUserCVsNamesByIDQuery from "@/graphql/users/cvs/getUserCVsNamesByID.query.gql";
import { checkUserID, getDetailedError } from "@/utils/handleErrors";
import { IUserCVNameData } from "@/types/userCVsUI";

export const getUserCVsNamesByID = async (id: string) => {
  try {
    checkUserID(id);

    const response = (await apolloClient.query({
      query: getUserCVsNamesByIDQuery,
      variables: { userId: Number(id) },
    })) as {
      data: { user: { cvs: IUserCVNameData[] } };
    };

    return response.data.user.cvs;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
