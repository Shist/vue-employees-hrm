import apolloClient from "@/plugins/apolloConfig";
import getCvDetailsByIdQuery from "@/graphql/cvs/details/getCvDetailsById.query.gql";
import updateCvQuery from "@/graphql/cvs/details/updateCv.mutation.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import { ICvDetailsServerData } from "@/types/pages/cvs/details";
import { IUpdateCvInput } from "@/types/cvsOperations";

export const getCvDetailsDataById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCvDetailsByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICvDetailsServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateCv = async (inputCvObj: IUpdateCvInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateCvQuery,
      variables: { cv: inputCvObj },
    })) as { data: { updateCv: ICvDetailsServerData } };

    return response.data.updateCv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
