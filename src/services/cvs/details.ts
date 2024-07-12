import apolloClient from "@/plugins/apolloConfig";
import getCVDetailsByIDQuery from "@/graphql/cvs/details/getCVDetailsByID.query.gql";
import updateCVQuery from "@/graphql/cvs/details/updateCV.mutation.gql";
import { checkCvID, getDetailedError } from "@/utils/handleErrors";
import { ICVDetailsServerData } from "@/types/cvDetailsUI";
import { IUpdateCVInput } from "@/types/backend-interfaces/cv";

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

export const updateCV = async (inputCVObj: IUpdateCVInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateCVQuery,
      variables: { cv: inputCVObj },
    })) as { data: { updateCv: ICVDetailsServerData } };

    return response.data.updateCv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
