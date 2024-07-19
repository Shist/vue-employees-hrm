import { DefaultOptions } from "@apollo/client";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import useCookies from "@/composables/useCookies";

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const { getToken } = useCookies();

  return {
    headers: {
      ...headers,
      authorization: getToken("accessToken"),
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
