import apolloClient from "@/plugins/apolloConfig";
import getAllSkillsQuery from "@/graphql/skills/getAllSkills.query.gql";
import getSkillCategoriesQuery from "@/graphql/skills/getSkillCategories.query.gql";
import { checkAccessToken, getDetailedError } from "@/utils/handleErrors";
import { ISkillsData } from "@/types/skillsStructures";

export const getAllSkills = async () => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.query({
      query: getAllSkillsQuery,
    })) as { data: { skills: ISkillsData[] } };

    return response.data.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getSkillCategories = async () => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.query({
      query: getSkillCategoriesQuery,
    })) as { data: { skillCategories: string[] } };

    return response.data.skillCategories;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
