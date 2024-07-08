import apolloClient from "@/plugins/apollo";
import getAllDepartmentNamesQuery from "@/graphql/queries/getAllDepartmentNames.query.gql";
import { IDepartmentNamesData } from "@/types/userProfileUI";

export const getAllDepartmentNames = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllDepartmentNamesQuery,
    })) as { data: { departments: IDepartmentNamesData[] } };

    return response.data.departments;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};
