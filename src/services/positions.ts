import apolloClient from "@/plugins/apolloConfig";
import getAllPositionNamesQuery from "@/graphql/positions/getAllPositionNames.query.gql";
import { checkAccessToken, getDetailedError } from "@/utils/handleErrors";
import { IPositionNamesData } from "@/types/pages/users/profile";

export const getAllPositionNames = async () => {
  try {
    await checkAccessToken();

    const response = (await apolloClient.query({
      query: getAllPositionNamesQuery,
    })) as { data: { positions: IPositionNamesData[] } };

    return response.data.positions;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
