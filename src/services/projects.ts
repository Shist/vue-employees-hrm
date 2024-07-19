import apolloClient from "@/plugins/apolloConfig";
import getAllProjectsQuery from "@/graphql/projects/getAllProjects.query.gql";
import getAllProjectsCvDataQuery from "@/graphql/projects/getAllProjectsCvData.query.gql";
import { getDetailedError } from "@/utils/handleErrors";
import { IProjectsTableServerData } from "@/types/pages/projectsTable";
import { IProjectsServerData } from "@/types/pages/cvs/projects";

export const getAllProjects = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllProjectsQuery,
    })) as { data: { projects: IProjectsTableServerData[] } };

    return response.data.projects;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getAllProjectsData = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllProjectsCvDataQuery,
    })) as { data: { projects: IProjectsServerData[] } };

    return response.data.projects;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
