import apolloClient from "@/plugins/apolloConfig";
import getAllDepartmentNamesQuery from "@/graphql/departments/getAllDepartmentNames.query.gql";
import { IDepartmentNamesData } from "@/types/userProfileUI";
import { getDetailedError } from "@/utils/handleErrors";

export const getAllDepartmentNames = async () => {
  try {
    const response = (await apolloClient.query({
      query: getAllDepartmentNamesQuery,
    })) as { data: { departments: IDepartmentNamesData[] } };

    return response.data.departments;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
