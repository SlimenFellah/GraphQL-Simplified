import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create HTTP link to GraphQL server
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Handle pagination for posts
            keyArgs: ['filter', 'sort'],
            merge(existing = { posts: [], totalCount: 0, hasNextPage: false, hasPreviousPage: false }, incoming) {
              return {
                ...incoming,
                posts: [...existing.posts, ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;