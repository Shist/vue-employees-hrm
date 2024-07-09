import apolloClient from "@/plugins/apollo";
import getAllSkillsQuery from "@/graphql/queries/getAllSkills.query.gql";
import getSkillCategoriesQuery from "@/graphql/queries/getSkillCategories.query.gql";
import { ISkillsData } from "@/types/userSkillsUI";

export const getAllSkills = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllSkillsQuery,
    })) as { data: { skills: ISkillsData[] } };

    return response.data.skills;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};

export const getSkillCategories = async () => {
  try {
    const response = (await apolloClient.query({
      query: getSkillCategoriesQuery,
    })) as { data: { skillCategories: string[] } };

    return response.data.skillCategories;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};
