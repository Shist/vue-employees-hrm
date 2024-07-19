import apolloClient from "@/plugins/apolloConfig";
import getCvNameByIdQuery from "@/graphql/cvs/getCvNameById.query.gql";
import createCvQuery from "@/graphql/cvs/createCv.mutation.gql";
import deleteCvQuery from "@/graphql/cvs/deleteCv.mutation.gql";
import getAllCvsQuery from "@/graphql/cvs/getAllCvs.query.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import { ICvNameData } from "@/types/navigation";
import { IUserCvNameData } from "@/types/pages/users/cvs";
import { ICreateCvInput, IDeleteCvInput } from "@/types/cvsOperations";
import { ICvsTableServerData } from "@/types/pages/cvs/table";

export const getAllCvs = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllCvsQuery,
    })) as { data: { cvs: ICvsTableServerData[] } };

    return response.data.cvs;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getCvNameDataById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCvNameByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICvNameData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const createCv = async (inputCvObj: ICreateCvInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: createCvQuery,
      variables: { cv: inputCvObj },
    })) as { data: { createCv: IUserCvNameData } };

    return response.data.createCv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteCv = async (inputCvObj: IDeleteCvInput) => {
  try {
    await apolloClient.mutate({
      mutation: deleteCvQuery,
      variables: { cv: inputCvObj },
    });
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
