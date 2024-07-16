import apolloClient from "@/plugins/apolloConfig";
import getAllProjectsQuery from "@/graphql/projects/getAllProjects.query.gql";
import getAllProjectsCVDataQuery from "@/graphql/projects/getAllProjectsCVData.query.gql";
import { getDetailedError } from "@/utils/handleErrors";
import {
  IProjectsTableData,
  IProjectsTableServerData,
} from "@/types/projectsTableUI";
import { IProjectsServerData } from "@/types/cvProjectsUI";

export const getAllProjects = async () => {
  const result: IProjectsTableData[] = [];
  try {
    const { projects } = (
      await apolloClient.query({
        query: getAllProjectsQuery,
      })
    ).data;

    projects.forEach((project: IProjectsTableServerData) => {
      result.push({
        id: project.id,
        name: project.name,
        internalName: project.internal_name,
        domain: project.domain,
        startDate: project.start_date,
        endDate: project.end_date ? project.end_date : "Till now",
        teamSize: project.team_size,
        description: project.description,
      });
    });
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
  return result;
};

export const getAllProjectsData = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllProjectsCVDataQuery,
    })) as { data: { projects: IProjectsServerData[] } };

    return response.data.projects;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
