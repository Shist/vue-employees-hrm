import apolloClient from "@/plugins/apolloConfig";
import getCVProjectsByIDQuery from "@/graphql/cvs/projects/getCVProjectsByID.query.gql";
import createCVProjectQuery from "@/graphql/cvs/projects/createCVProject.mutation.gql";
import deleteCVProjectQuery from "@/graphql/cvs/projects/deleteCVProject.mutation.gql";
import { checkCvID, getDetailedError } from "@/utils/handleErrors";
import {
  IAddOrUpdateCVProjectInput,
  IRemoveCVProjectInput,
} from "@/types/backend-interfaces/cv/project";
import { ICVProjectsTableServerData } from "@/types/cvProjectsUI";

export const getCVProjectsByID = async (id: string) => {
  try {
    checkCvID(id);

    const response = (await apolloClient.query({
      query: getCVProjectsByIDQuery,
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
