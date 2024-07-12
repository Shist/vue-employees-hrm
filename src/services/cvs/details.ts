import apolloClient from "@/plugins/apolloConfig";
import getCVDetailsByIDQuery from "@/graphql/cvs/details/getCVDetailsByID.query.gql";
import { checkCvID, getDetailedError } from "@/utils/handleErrors";
import { ICVDetailsServerData } from "@/types/cvDetailsUI";

export const getCVDetailsDataByID = async (id: string) => {
  try {
    checkCvID(id);

    const response = (await apolloClient.query({
      query: getCVDetailsByIDQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVDetailsServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
