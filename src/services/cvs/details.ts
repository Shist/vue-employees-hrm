import apolloClient from "@/plugins/apolloConfig";
import getCVDetailsByIdQuery from "@/graphql/cvs/details/getCVDetailsById.query.gql";
import updateCVQuery from "@/graphql/cvs/details/updateCV.mutation.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import { ICVDetailsServerData } from "@/types/cvDetailsUI";
import { IUpdateCVInput } from "@/types/backend-interfaces/cv";

export const getCVDetailsDataById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCVDetailsByIdQuery,
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
