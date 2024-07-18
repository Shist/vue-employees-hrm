import apolloClient from "@/plugins/apolloConfig";
import getCvSkillsByIdQuery from "@/graphql/cvs/skills/getCVSkillsById.query.gql";
import createCvSkillQuery from "@/graphql/cvs/skills/createCVSkill.mutation.gql";
import updateCvSkillQuery from "@/graphql/cvs/skills/updateCVSkill.mutation.gql";
import deleteCvSkillsQuery from "@/graphql/cvs/skills/deleteCVSkills.mutation.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import {
  IAddOrUpdateCvSkillInput,
  IDeleteCvSkillInput,
} from "@/types/backend-interfaces/cv/skill";
import { ICVSkillsServerData } from "@/types/skillsUI";

export const getCVSkillsById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCvSkillsByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVSkillsServerData } };

    return response.data.cv;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const createCvSkill = async (
  inputSkillObj: IAddOrUpdateCvSkillInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: createCvSkillQuery,
      variables: { skill: inputSkillObj },
    })) as { data: { addCvSkill: ICVSkillsServerData } };

    return response.data.addCvSkill;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateCvSkill = async (
  inputSkillObj: IAddOrUpdateCvSkillInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateCvSkillQuery,
      variables: { skill: inputSkillObj },
    })) as { data: { updateCvSkill: ICVSkillsServerData } };

    return response.data.updateCvSkill;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteCvSkills = async (inputSkillObj: IDeleteCvSkillInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: deleteCvSkillsQuery,
      variables: { skills: inputSkillObj },
    })) as { data: { deleteCvSkill: ICVSkillsServerData } };

    return response.data.deleteCvSkill;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
