import apolloClient from "@/plugins/apolloConfig";
import getCVProjectsByIdQuery from "@/graphql/cvs/projects/getCVProjectsById.query.gql";
import createCVProjectQuery from "@/graphql/cvs/projects/createCVProject.mutation.gql";
import deleteCVProjectQuery from "@/graphql/cvs/projects/deleteCVProject.mutation.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import {
  IAddOrUpdateCVProjectInput,
  IRemoveCVProjectInput,
} from "@/types/backend-interfaces/cv/project";
import { ICVProjectsTableServerData } from "@/types/cvProjectsUI";

export const getCVProjectsById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCVProjectsByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVProjectsTableServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const createCvProject = async (
  inputProjectObj: IAddOrUpdateCVProjectInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: createCVProjectQuery,
      variables: { project: inputProjectObj },
    })) as { data: { addCvProject: ICVProjectsTableServerData } };

    return response.data.addCvProject;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteCvProject = async (
  inputProjectObj: IRemoveCVProjectInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: deleteCVProjectQuery,
      variables: { project: inputProjectObj },
    })) as { data: { removeCvProject: ICVProjectsTableServerData } };

    return response.data.removeCvProject;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
