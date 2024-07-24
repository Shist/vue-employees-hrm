import { DefaultOptions } from "@apollo/client";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import useCookies from "@/composables/useCookies";
import { refreshAccessToken } from "@/utils/handleErrors";
import { ITokenData } from "@/types/authData";

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL,
});

const authLink = setContext(async (request, { headers }) => {
  const { getToken } = useCookies();

  let accessToken = getToken("accessToken");

  const accessTokenData: ITokenData | null = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1]))
    : null;

  let isAccessTokenValid =
    accessTokenData && new Date(accessTokenData.exp * 1000) > new Date();

  const isAuthRequiredRequest = ![
    "UPDATE_TOKEN",
    "SIGN_IN",
    "SIGN_UP",
  ].includes(`${request.operationName}`);

  if (!isAccessTokenValid && isAuthRequiredRequest) {
    await refreshAccessToken();

    accessToken = getToken("accessToken");

    isAccessTokenValid = true;
  }

  return {
    headers: {
      ...headers,
      authorization: isAccessTokenValid
        ? accessToken
        : getToken("refreshToken"),
    },
  };
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
  },
  query: {
    fetchPolicy: "no-cache",
  },
};

const cache = new InMemoryCache({
  typePolicies: {
    Profile: {
      fields: {
        skills: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
        languages: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Cv: {
      fields: {
        skills: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: defaultOptions,
});

export default apolloClient;
