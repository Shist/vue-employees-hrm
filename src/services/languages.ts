import apolloClient from "@/plugins/apolloConfig";
import getAllLanguagesQuery from "@/graphql/languages/getAllLanguages.query.gql";
import getAllLanguagesNamesQuery from "@/graphql/languages/getAllLanguagesNames.query.gql";
import { checkAccessToken, getDetailedError } from "@/utils/handleErrors";
import { ILanguagesTableServerData } from "@/types/pages/languagesTable";
import { ILanguagesNamesData } from "@/types/pages/users/languages";

export const getAllLanguages = async () => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.query({
      query: getAllLanguagesQuery,
    })) as { data: { languages: ILanguagesTableServerData[] } };

    return response.data.languages;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const getAllLanguagesNames = async () => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.query({
      query: getAllLanguagesNamesQuery,
    })) as { data: { languages: ILanguagesNamesData[] } };

    return response.data.languages;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
