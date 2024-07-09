import apolloClient from "@/plugins/apollo";
import getAllLanguagesNamesQuery from "@/graphql/queries/getAllLanguagesNames.query.gql";
import { ILanguagesNamesData } from "@/types/userLanguagesUI";

export const getAllLanguagesNames = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllLanguagesNamesQuery,
    })) as { data: { languages: ILanguagesNamesData[] } };

    return response.data.languages;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};
