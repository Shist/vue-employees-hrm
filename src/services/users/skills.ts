import apolloClient from "@/plugins/apolloConfig";
import getUserSkillsByIDQuery from "@/graphql/users/skills/getUserSkillsByID.query.gql";
import createUserSkillQuery from "@/graphql/users/skills/createUserSkill.mutation.gql";
import updateUserSkillQuery from "@/graphql/users/skills/updateUserSkill.mutation.gql";
import deleteUserSkillsQuery from "@/graphql/users/skills/deleteUserSkills.mutation.gql";
import { checkUserID, getDetailedError } from "@/utils/handleErrors";
import {
  IAddOrUpdateProfileSkillInput,
  IDeleteProfileSkillInput,
  IProfileSkill,
} from "@/types/backend-interfaces/user/profile/skill";

export const getUserSkillsByID = async (id: string) => {
  try {
    checkUserID(id);

    const response = (await apolloClient.query({
      query: getUserSkillsByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: { profile: { skills: IProfileSkill[] } } } };

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
    })) as { data: { addProfileSkill: { skills: IProfileSkill[] } } };

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
    })) as { data: { updateProfileSkill: { skills: IProfileSkill[] } } };

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
    })) as { data: { deleteProfileSkill: { skills: IProfileSkill[] } } };

    return response.data.deleteProfileSkill.skills;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
