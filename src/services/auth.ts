import apolloClient from "@/plugins/apollo";
import loginQuery from "@/graphql/queries/login.query.gql";
import signupMutation from "@/graphql/mutations/signUp.mutation.gql";
import {
  INVALID_CREDENTIALS,
  NO_NETWORK_CONNECTION,
  UNEXPECTED_ERROR,
} from "@/constants/errorMessage";

export const login = async (email: string, password: string) => {
  try {
    const { login } = (
      await apolloClient.query({
        query: loginQuery,
        variables: { auth: { email, password } },
      })
    ).data;

    if (!login) return;

    await apolloClient.resetStore();

    const token = login.access_token;

    const user = {
      id: login.user.id,
      email: login.user.email,
      first_name: login.user.profile.first_name,
      last_name: login.user.profile.last_name,
      full_name: login.user.profile.full_name,
      avatar: login.user.profile.avatar,
    };

    return { user, token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        throw new Error(INVALID_CREDENTIALS);
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      } else {
        throw new Error(UNEXPECTED_ERROR);
      }
    } else {
      throw new Error(UNEXPECTED_ERROR);
    }
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

    if (!signup) return;

    await apolloClient.resetStore();

    const token = signup.access_token;

    const user = {
      id: signup.user.id,
      email: signup.user.email,
      first_name: signup.user.profile.first_name,
      last_name: signup.user.profile.last_name,
      full_name: signup.user.profile.full_name,
      avatar: signup.user.profile.avatar,
    };

    return { user, token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        throw new Error(INVALID_CREDENTIALS);
      } else if (error.message === "Failed to fetch") {
        throw new Error(NO_NETWORK_CONNECTION);
      } else if (
        error.message ===
        'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"'
      ) {
        throw new Error(`User with email: ${email} already exists`);
      } else {
        throw new Error(UNEXPECTED_ERROR);
      }
    } else {
      throw new Error(UNEXPECTED_ERROR);
    }
  }
};
