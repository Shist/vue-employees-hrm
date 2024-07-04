import apolloClient from "@/plugins/apollo";
import loginQuery from "@/graphql/queries/login.query.gql";
import signupMutation from "@/graphql/mutations/signUp.mutation.gql";

export const login = async (email: string, password: string) => {
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
    firstName: login.user.profile.first_name,
    lastName: login.user.profile.last_name,
    fullName: login.user.profile.full_name,
    avatar: login.user.profile.avatar,
  };

  return { user, token };
};

export const register = async (email: string, password: string) => {
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
    firstName: signup.user.profile.first_name,
    lastName: signup.user.profile.last_name,
    fullName: signup.user.profile.full_name,
    avatar: signup.user.profile.avatar,
  };

  return { user, token };
};
