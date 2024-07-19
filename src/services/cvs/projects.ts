import apolloClient from "@/plugins/apolloConfig";
import getCvProjectsByIdQuery from "@/graphql/cvs/projects/getCvProjectsById.query.gql";
import createCvProjectQuery from "@/graphql/cvs/projects/createCvProject.mutation.gql";
import deleteCvProjectQuery from "@/graphql/cvs/projects/deleteCvProject.mutation.gql";
import {
  checkCvId,
  checkAccessToken,
  getDetailedError,
} from "@/utils/handleErrors";
import {
  ICvProjectsTableServerData,
  IAddOrUpdateCvProjectInput,
  IRemoveCvProjectInput,
} from "@/types/pages/cvs/projects";

export const getCvProjectsById = async (id: string) => {
  try {
    await checkAccessToken();

    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCvProjectsByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICvProjectsTableServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const createCvProject = async (
  inputProjectObj: IAddOrUpdateCvProjectInput
) => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.mutate({
      mutation: createCvProjectQuery,
      variables: { project: inputProjectObj },
    })) as { data: { addCvProject: ICvProjectsTableServerData } };

    return response.data.addCvProject;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteCvProject = async (
  inputProjectObj: IRemoveCvProjectInput
) => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.mutate({
      mutation: deleteCvProjectQuery,
      variables: { project: inputProjectObj },
    })) as { data: { removeCvProject: ICvProjectsTableServerData } };

    return response.data.removeCvProject;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
