import Vue from 'vue'
import * as Realm from "realm-web";
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { GRAPHQL_URL, APP_ID } from './constants'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

// Connect to your MongoDB Realm app
const app = new Realm.App(APP_ID);

// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. The logged in user will have a valid
    // access token.
    // await app.logIn(Realm.Credentials.anonymous());
    await app.logIn(Realm.Credentials.apiKey(process.env.VUE_APP_REALM_API_KEY || ''));
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData();
  }

  return app.currentUser?.accessToken
}

const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_URL,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      if (options?.headers !== undefined) {
        (options.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
      }
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache(),
});

export function createApolloProvider() {
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  })
  return apolloProvider
}