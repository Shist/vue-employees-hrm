import apolloClient from "@/plugins/apolloConfig";
import {
  IAddOrUpdateProfileLanguageInput,
  IProfileLanguage,
} from "@/types/backend-interfaces/user/profile/language";
import { checkUserID, getDetailedError } from "@/utils/handleErrors";
import getUserLanguagesByIDQuery from "@/graphql/users/languages/getUserLanguagesByID.query.gql";
import createUserLanguageQuery from "@/graphql/users/languages/createUserLanguage.mutation.gql";
import updateUserLanguageQuery from "@/graphql/users/languages/updateUserLanguage.mutation.gql";
import { IDeleteProfileLanguageInput } from "@/types/backend-interfaces/language/proficiency";
import deleteUserLanguagesQuery from "@/graphql/users/languages/deleteUserLanguages.mutation.gql";

export const getUserLanguagesByID = async (id: string) => {
  try {
    checkUserID(id);

    const response = (await apolloClient.query({
      query: getUserLanguagesByIDQuery,
      variables: { userId: Number(id) },
    })) as {
      data: { user: { profile: { languages: IProfileLanguage[] } } };
    };

    return response.data.user.profile.languages;
  } catch (error: unknown) {
    throw getDetailedError(error);
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
    throw getDetailedError(error);
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
    throw getDetailedError(error);
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
    throw getDetailedError(error);
  }
};
