import apolloClient from "@/plugins/apolloConfig";
import getAllPositionNamesQuery from "@/graphql/positions/getAllPositionNames.query.gql";
import { IPositionNamesData } from "@/types/userProfileUI";
import { getDetailedError } from "@/utils/handleErrors";

export const getAllPositionNames = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllPositionNamesQuery,
    })) as { data: { positions: IPositionNamesData[] } };

    return response.data.positions;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
