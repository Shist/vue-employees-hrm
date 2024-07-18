import apolloClient from "@/plugins/apolloConfig";
import loginQuery from "@/graphql/auth/login.query.gql";
import signupMutation from "@/graphql/auth/signUp.mutation.gql";
import updateAccessTokenMutation from "@/graphql/auth/updateAccessToken.mutation.gql";
import { getDetailedError } from "@/utils/handleErrors";

export const login = async (email: string, password: string) => {
  try {
    const { login } = (
      await apolloClient.query({
        query: loginQuery,
        variables: { auth: { email, password } },
      })
    ).data;

    await apolloClient.resetStore();

    const token = login.access_token;

    const user = {
      id: login.user.id,
      email: login.user.email,
      firstName: login.user.profile.first_name,
      lastName: login.user.profile.last_name,
      fullName: login.user.profile.full_name,
      avatar: login.user.profile.avatar,
    };

    return { user, token };
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const register = async (email: string, password: string) => {
  try {
    const { signup } = (
      await apolloClient.mutate({
        mutation: signupMutation,
        variables: { auth: { email, password } },
      })
    ).data;

    await apolloClient.resetStore();

    const token = signup.access_token;

    const user = {
      id: signup.user.id,
      email: signup.user.email,
      firstName: signup.user.profile.first_name,
      lastName: signup.user.profile.last_name,
      fullName: signup.user.profile.full_name,
      avatar: signup.user.profile.avatar,
    };

    return { user, token };
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};

export const updateAccessToken = async () => {
  try {
    const response = (await apolloClient.mutate({
      mutation: updateAccessTokenMutation,
    })) as { data: { updateToken: { access_token: string } } };

    return response.data.updateToken.access_token;
  } catch (error: unknown) {
    throw getDetailedError(error);
  }
};
