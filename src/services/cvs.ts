import apolloClient from "@/plugins/apollo";
import checkID from "@/utils/checkID";
import getCVNameByIDQuery from "@/graphql/queries/getCVNameByID.query.gql";
import { ICVNameData } from "@/types/breadcrumbsUI";

export const getCVNameDataByID = async (id: string) => {
  try {
    checkID(id);

    const response = (await apolloClient.query({
      query: getCVNameByIDQuery,
      variables: { cvId: Number(id) },
    })) as { data: { cv: ICVNameData } };

    return response.data.cv;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};
