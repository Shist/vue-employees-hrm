import apolloClient from "@/plugins/apolloConfig";
import getCVPreviewDataByIDQuery from "@/graphql/cvs/preview/getCVPreviewDataByID.query.gql";
import { checkCvID, getDetailedError } from "@/utils/handleErrors";
import { ICVPreviewServerData } from "@/types/cvPreviewUI";

export const getCVPreviewDataByID = async (id: string) => {
  try {
    checkCvID(id);

    const response = (await apolloClient.query({
      query: getCVPreviewDataByIDQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVPreviewServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
