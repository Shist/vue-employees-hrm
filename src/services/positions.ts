import apolloClient from "@/plugins/apolloConfig";
import getAllPositionNamesQuery from "@/graphql/positions/getAllPositionNames.query.gql";
import { IPositionNamesData } from "@/types/userProfileUI";

export const getAllPositionNames = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllPositionNamesQuery,
    })) as { data: { positions: IPositionNamesData[] } };

    return response.data.positions;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};
