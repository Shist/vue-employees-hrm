import apolloClient from "@/plugins/apolloConfig";
import getAllSkillsQuery from "@/graphql/skills/getAllSkills.query.gql";
import { getDetailedError } from "@/utils/handleErrors";
import { ISkillsData } from "@/types/skillsStructures";

export const getAllSkills = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllSkillsQuery,
    })) as { data: { skills: ISkillsData[] } };

    return response.data.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
