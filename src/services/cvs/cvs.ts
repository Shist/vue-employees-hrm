import apolloClient from "@/plugins/apolloConfig";
import getCVNameByIdQuery from "@/graphql/cvs/getCVNameById.query.gql";
import createCVQuery from "@/graphql/cvs/createCV.mutation.gql";
import deleteCVQuery from "@/graphql/cvs/deleteCV.mutation.gql";
import getAllCvsQuery from "@/graphql/cvs/getAllCvs.query.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import { ICVNameData } from "@/types/breadcrumbsUI";
import { IUserCVNameData } from "@/types/userCVsUI";
import { ICreateCVInput, IDeleteCVInput } from "@/types/backend-interfaces/cv";
import { ICvsTableServerData } from "@/types/cvsTableUI";

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

export const getCVNameDataById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCVNameByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVNameData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const createCV = async (inputCVObj: ICreateCVInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: createCVQuery,
      variables: { cv: inputCVObj },
    })) as { data: { createCv: IUserCVNameData } };

    return response.data.createCv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteCV = async (inputCVObj: IDeleteCVInput) => {
  try {
    await apolloClient.mutate({
      mutation: deleteCVQuery,
      variables: { cv: inputCVObj },
    });
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
