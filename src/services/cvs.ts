import apolloClient from "@/plugins/apolloConfig";
import checkID from "@/utils/checkID";
import getCVNameByIDQuery from "@/graphql/cvs/getCVNameByID.query.gql";
import createCVQuery from "@/graphql/cvs/createCV.mutation.gql";
import deleteCVQuery from "@/graphql/cvs/deleteCV.mutation.gql";
import { ICVNameData } from "@/types/breadcrumbsUI";
import { IUserCVNameData } from "@/types/userCVsUI";
import { ICreateCVInput, IDeleteCVInput } from "@/types/backend-interfaces/cv";

export const getCVNameDataByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getCVNameByIDQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVNameData } };

    return response.data.cv;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
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
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};

export const deleteCV = async (inputCVObj: IDeleteCVInput) => {
  try {
    await apolloClient.mutate({
      mutation: deleteCVQuery,
      variables: { cv: inputCVObj },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};
