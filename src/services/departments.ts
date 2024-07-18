import apolloClient from "@/plugins/apolloConfig";
import getAllDepartmentNamesQuery from "@/graphql/departments/getAllDepartmentNames.query.gql";
import { getDetailedError } from "@/utils/handleErrors";
import { IDepartmentNamesData } from "@/types/pages/users/profile";

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
