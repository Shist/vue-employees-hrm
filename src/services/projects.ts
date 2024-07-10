import apolloClient from "@/plugins/apollo";
import {
  IProjectsTableData,
  IProjectsTableServerData,
} from "@/types/projectsTableUI";
import getAllProjectsQuery from "@/graphql/queries/getAllProjects.query.gql";

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
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return result;
};
