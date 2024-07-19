import apolloClient from "@/plugins/apolloConfig";
import getCvSkillsByIdQuery from "@/graphql/cvs/skills/getCvSkillsById.query.gql";
import createCvSkillQuery from "@/graphql/cvs/skills/createCvSkill.mutation.gql";
import updateCvSkillQuery from "@/graphql/cvs/skills/updateCvSkill.mutation.gql";
import deleteCvSkillsQuery from "@/graphql/cvs/skills/deleteCvSkills.mutation.gql";
import { checkCvId, getDetailedError } from "@/utils/handleErrors";
import { ICvSkillsServerData } from "@/types/skillsStructures";
import {
  IAddOrUpdateCvSkillInput,
  IDeleteCvSkillInput,
} from "@/types/pages/cvs/skills";

export const getCvSkillsById = async (id: string) => {
  try {
    checkCvId(id);

    const response = (await apolloClient.query({
      query: getCvSkillsByIdQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICvSkillsServerData } };

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
    })) as { data: { addCvSkill: ICvSkillsServerData } };

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
    })) as { data: { updateCvSkill: ICvSkillsServerData } };

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
    })) as { data: { deleteCvSkill: ICvSkillsServerData } };

    return response.data.deleteCvSkill;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
