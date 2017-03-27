import ApolloClient from 'apollo-client';

// Apollo will identify and de-duplicate the objects returned from the server.
// The query object contain id and __typename to de-duplicate objects
export function dataIdFromObject(result) {
  if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
    return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
  }
  return null;
}

export default function createApolloClient({
  networkInterface,
  ssrMode = false,
  connectToDevTools = false,
}) {
  // apollo client, connect to graphql api server
  const client = new ApolloClient({
    networkInterface,
    dataIdFromObject,
    ssrMode,
    connectToDevTools,
  });
  return client;
}
