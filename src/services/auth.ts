import apolloClient from "@/plugins/apollo";
import loginQuery from "@/graphql/queries/login.query.gql";
import signupMutation from "@/graphql/mutations/signUp.mutation.gql";
import { IUserAuthData } from "@/types/userAuthUI";

export const login = async (email: string, password: string) => {
  let token: string | null = null;
  let user: IUserAuthData | null = null;

  try {
    const databaseResult = await apolloClient.query({
      query: loginQuery,
      variables: { auth: { email, password } },
    });

    if (databaseResult.data.login) {
      await apolloClient.resetStore();

      token = databaseResult.data.login.access_token;

      user = {
        id: databaseResult.data.login.user.id,
        email: databaseResult.data.login.user.email,
        first_name: databaseResult.data.login.user.profile.first_name,
        last_name: databaseResult.data.login.user.profile.last_name,
        full_name: databaseResult.data.login.user.profile.full_name,
        avatar: databaseResult.data.login.user.profile.avatar,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return { user, token };
};

export const register = async (email: string, password: string) => {
  let token: string | null = null;
  let user: IUserAuthData | null = null;

  try {
    const databaseResult = await apolloClient.mutate({
      mutation: signupMutation,
      variables: { auth: { email, password } },
    });

    if (databaseResult.data.signup) {
      await apolloClient.resetStore();

      token = databaseResult.data.signup.access_token;

      user = {
        id: databaseResult.data.signup.user.id,
        email: databaseResult.data.signup.user.email,
        first_name: databaseResult.data.signup.user.profile.first_name,
        last_name: databaseResult.data.signup.user.profile.last_name,
        full_name: databaseResult.data.signup.user.profile.full_name,
        avatar: databaseResult.data.signup.user.profile.avatar,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return { user, token };
};
