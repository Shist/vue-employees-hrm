import apolloClient from "@/plugins/apolloConfig";
import getUserSkillsByIdQuery from "@/graphql/users/skills/getUserSkillsById.query.gql";
import createUserSkillQuery from "@/graphql/users/skills/createUserSkill.mutation.gql";
import updateUserSkillQuery from "@/graphql/users/skills/updateUserSkill.mutation.gql";
import deleteUserSkillsQuery from "@/graphql/users/skills/deleteUserSkills.mutation.gql";
import { checkUserId, getDetailedError } from "@/utils/handleErrors";
import { ISkill } from "@/types/skillsStructures";
import {
  IAddOrUpdateProfileSkillInput,
  IDeleteProfileSkillInput,
} from "@/types/pages/users/skills";

export const getUserSkillsById = async (id: string) => {
  try {
    checkUserId(id);

    const response = (await apolloClient.query({
      query: getUserSkillsByIdQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: { profile: { skills: ISkill[] } } } };

    return response.data.user.profile.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const createUserSkill = async (
  inputSkillObj: IAddOrUpdateProfileSkillInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: createUserSkillQuery,
      variables: { skill: inputSkillObj },
    })) as { data: { addProfileSkill: { skills: ISkill[] } } };

    return response.data.addProfileSkill.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateUserSkill = async (
  inputSkillObj: IAddOrUpdateProfileSkillInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateUserSkillQuery,
      variables: { skill: inputSkillObj },
    })) as { data: { updateProfileSkill: { skills: ISkill[] } } };

    return response.data.updateProfileSkill.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const deleteUserSkills = async (
  inputSkillObj: IDeleteProfileSkillInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: deleteUserSkillsQuery,
      variables: { skills: inputSkillObj },
    })) as { data: { deleteProfileSkill: { skills: ISkill[] } } };

    return response.data.deleteProfileSkill.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
