import apolloClient from "@/plugins/apolloConfig";
import getAllUsersQuery from "@/graphql/users/getAllUsers.query.gql";
import getUserProfileByIDQuery from "@/graphql/users/profile/getUserProfileByID.query.gql";
import getUserAuthDataByIDQuery from "@/graphql/users/getUserAuthDataByID.query.gql";
import getUserFullnameByIDQuery from "@/graphql/users/getUserFullnameByID.query.gql";
import getUserSkillsByIDQuery from "@/graphql/users/skills/getUserSkillsByID.query.gql";
import getUserLanguagesByIDQuery from "@/graphql/users/languages/getUserLanguagesByID.query.gql";
import getUserCVsNamesByIDQuery from "@/graphql/users/cvs/getUserCVsNamesByID.query.gql";
import updateUserQuery from "@/graphql/users/updateUser.mutation.gql";
import updateProfileQuery from "@/graphql/users/profile/updateProfile.mutation.gql";
import uploadAvatarQuery from "@/graphql/users/profile/uploadAvatar.mutation.gql";
import deleteAvatarQuery from "@/graphql/users/profile/deleteAvatar.mutation.gql";
import createUserSkillQuery from "@/graphql/users/skills/createUserSkill.mutation.gql";
import updateUserSkillQuery from "@/graphql/users/skills/updateUserSkill.mutation.gql";
import deleteUserSkillsQuery from "@/graphql/users/skills/deleteUserSkills.mutation.gql";
import createUserLanguageQuery from "@/graphql/users/languages/createUserLanguage.mutation.gql";
import updateUserLanguageQuery from "@/graphql/users/languages/updateUserLanguage.mutation.gql";
import deleteUserLanguagesQuery from "@/graphql/users/languages/deleteUserLanguages.mutation.gql";
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
        firstName: user.profile.first_name,
        lastName: user.profile.last_name,
        departmentName: user.department_name,
        positionName: user.position_name,
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
