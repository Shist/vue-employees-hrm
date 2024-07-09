import apolloClient from "@/plugins/apollo";
import {
  IProjectsTableData,
  IProjectsTableServerData,
} from "@/types/projectsTableUI";
import getAllProjectsQuery from "@/graphql/queries/getAllProjects.query.gql";
import deleteProjectMutation from "@/graphql/mutations/deleteProject.mutation.gql";
import createProjectMutation from "@/graphql/mutations/createProject.mutation.gql";
import updateProjectMutation from "@/graphql/mutations/updateProject.mutation.gql";
import { NO_NETWORK_CONNECTION } from "@/constants/errorMessage";
import {
  ICreateProjectInput,
  IUpdateProjectInput,
} from "@/types/backend-interfaces/project";

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

export const deleteProject = async (id: number) => {
  try {
    await apolloClient.mutate({
      mutation: deleteProjectMutation,
      variables: { project: { projectId: Number(id) } },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }
  }
};

export const createProject = async (project: ICreateProjectInput) => {
  try {
    await apolloClient.mutate({
      mutation: createProjectMutation,
      variables: { project: project },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }
  }
};

export const updateProject = async (project: IUpdateProjectInput) => {
  try {
    await apolloClient.mutate({
      mutation: updateProjectMutation,
      variables: { project: project },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }
  }
};
