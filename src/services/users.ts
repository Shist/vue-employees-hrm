import apolloClient from "@/plugins/apollo";
import getAllUsersQuery from "@/graphql/queries/getAllUsers.query.gql";
import getUserProfileByIDQuery from "@/graphql/queries/getUserProfileByID.query.gql";
import getUserAuthDataByIDQuery from "@/graphql/queries/getUserAuthDataByID.query.gql";
import getUserFullnameByIDQuery from "@/graphql/queries/getUserFullnameByID.query.gql";
import getUserSkillsByIDQuery from "@/graphql/queries/getUserSkillsByID.query.gql";
import getUserLanguagesByIDQuery from "@/graphql/queries/getUserLanguagesByID.query.gql";
import getUserCVsNamesByIDQuery from "@/graphql/queries/getUserCVsNamesByID.query.gql";
import updateUserQuery from "@/graphql/mutations/updateUser.mutation.gql";
import updateProfileQuery from "@/graphql/mutations/updateProfile.mutation.gql";
import uploadAvatarQuery from "@/graphql/mutations/uploadAvatar.mutation.gql";
import deleteAvatarQuery from "@/graphql/mutations/deleteAvatar.mutation.gql";
import createUserSkillQuery from "@/graphql/mutations/createUserSkill.mutation.gql";
import updateUserSkillQuery from "@/graphql/mutations/updateUserSkill.mutation.gql";
import deleteUserSkillsQuery from "@/graphql/mutations/deleteUserSkills.mutation.gql";
import createUserLanguageQuery from "@/graphql/mutations/createUserLanguage.mutation.gql";
import updateUserLanguageQuery from "@/graphql/mutations/updateUserLanguage.mutation.gql";
import deleteUserLanguagesQuery from "@/graphql/mutations/deleteUserLanguages.mutation.gql";
import { IUsersTableData, IUsersTableServerData } from "@/types/usersTableUI";
import { IUserProfileServerData } from "@/types/userProfileUI";
import { IUsersNameServerData } from "@/types/breadcrumbsUI";
import { IUserAuthServerData } from "@/types/userAuthUI";
import { IUserCVNameData } from "@/types/userCVsUI";
import { IUpdateUserInput } from "@/types/backend-interfaces/user";
import { IUpdateProfileInput } from "@/types/backend-interfaces/user/profile";
import { IUploadAvatarInput } from "@/types/backend-interfaces/user/avatar";
import {
  IProfileSkill,
  IAddOrUpdateProfileSkillInput,
  IDeleteProfileSkillInput,
} from "@/types/backend-interfaces/user/profile/skill";
import {
  IProfileLanguage,
  IAddOrUpdateProfileLanguageInput,
  IDeleteProfileLanguageInput,
} from "@/types/backend-interfaces/user/profile/language";
import checkID from "@/utils/checkID";
import {
  NOT_FOUND_USER,
  GRAPHQL_NULL_RETURN_ERROR,
  NO_NETWORK_CONNECTION,
} from "@/constants/errorMessage";

export const getAllUsers = async () => {
  const result: IUsersTableData[] = [];

  try {
    const response = (await apolloClient.query({
      query: getAllUsersQuery,
    })) as { data: { users: IUsersTableServerData[] } };

    response.data.users.forEach((user: IUsersTableServerData) => {
      result.push({
        id: user.id,
        email: user.email,
        avatar: user.profile.avatar,
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        department_name: user.department_name,
        position_name: user.position_name,
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }

  return result;
};

export const getUserAuthDataByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserAuthDataByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUserAuthServerData } };

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};

export const getUserNameDataByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserFullnameByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUsersNameServerData } };

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};

export const getUserProfileByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserProfileByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: IUserProfileServerData } };

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith(GRAPHQL_NULL_RETURN_ERROR)) {
        const notFoundError = new Error(NOT_FOUND_USER);
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const getUserSkillsByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserSkillsByIDQuery,
      variables: { userId: Number(id) },
    })) as { data: { user: { profile: { skills: IProfileSkill[] } } } };

    return response.data.user.profile.skills;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith(GRAPHQL_NULL_RETURN_ERROR)) {
        const notFoundError = new Error(NOT_FOUND_USER);
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const getUserLanguagesByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserLanguagesByIDQuery,
      variables: { userId: Number(id) },
    })) as {
      data: { user: { profile: { languages: IProfileLanguage[] } } };
    };

    return response.data.user.profile.languages;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith(GRAPHQL_NULL_RETURN_ERROR)) {
        const notFoundError = new Error(NOT_FOUND_USER);
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const getUserCVsNamesByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getUserCVsNamesByIDQuery,
      variables: { userId: Number(id) },
    })) as {
      data: { user: { cvs: IUserCVNameData[] } };
    };

    return response.data.user.cvs;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith(GRAPHQL_NULL_RETURN_ERROR)) {
        const notFoundError = new Error(NOT_FOUND_USER);
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const updateUserData = async (
  inputUserObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
  inputProfileObj: IUpdateProfileInput
) => {
  try {
    await apolloClient.mutate({
      mutation: updateProfileQuery,
      variables: { profile: inputProfileObj },
    });

    const response = (await apolloClient.mutate({
      mutation: updateUserQuery,
      variables: { user: inputUserObj },
    })) as { data: { updateUser: IUserProfileServerData } };

    return response.data.updateUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const updateUserAvatar = async (inputAvatarObj: IUploadAvatarInput) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: uploadAvatarQuery,
      variables: { avatar: inputAvatarObj },
    })) as { data: { uploadAvatar: string } };

    return response.data.uploadAvatar;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const deleteUserAvatar = async (id: string) => {
  try {
    await apolloClient.mutate({
      mutation: deleteAvatarQuery,
      variables: { avatar: { userId: Number(id) } },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
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
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
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
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
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
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const createUserLanguage = async (
  inputLanguageObj: IAddOrUpdateProfileLanguageInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: createUserLanguageQuery,
      variables: { language: inputLanguageObj },
    })) as { data: { addProfileLanguage: { languages: IProfileLanguage[] } } };

    return response.data.addProfileLanguage.languages;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const updateUserLanguage = async (
  inputLanguageObj: IAddOrUpdateProfileLanguageInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateUserLanguageQuery,
      variables: { language: inputLanguageObj },
    })) as {
      data: { updateProfileLanguage: { languages: IProfileLanguage[] } };
    };

    return response.data.updateProfileLanguage.languages;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};

export const deleteUserLanguages = async (
  inputLanguageObj: IDeleteProfileLanguageInput
) => {
  try {
    const response = (await apolloClient.mutate({
      mutation: deleteUserLanguagesQuery,
      variables: { languages: inputLanguageObj },
    })) as {
      data: { deleteProfileLanguage: { languages: IProfileLanguage[] } };
    };

    return response.data.deleteProfileLanguage.languages;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      }
    }

    throw error;
  }
};
