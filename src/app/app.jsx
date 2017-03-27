import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { AppContainer } from 'react-hot-loader';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import createHistory from 'history/createBrowserHistory';
import { createNetworkInterface } from 'apollo-client';
import { ConnectedRouter } from 'react-router-redux';
import createApolloClient from '~/app/redux/apolloClient';
import configureStore from '~/app/redux/store';
import Root from '~/app/containers/Root';
import routes from '~/app/routes';

async function startApp() {
  const history = createHistory();
  const $root = document.getElementById('react-root');
  const networkInterface = createNetworkInterface({
    uri: '/graphql',
    // allow same origin credentials, i.e same protocol, same host to pass cookies
    opts: {
      credentials: 'same-origin',
    },
  });
  // initialize the apollo client that could connect to graphql server
  const apolloClient = createApolloClient({
    networkInterface,
    ssrMode: false,
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
  // configure store
  const store = configureStore({
    initialState: window.__REDUX_STATE__, // eslint-disable-line no-underscore-dangle
    apolloClient,
    history,
  });
  const rehydrateState =
    window.__ASYNC_COMPONENTS_STATE__; // eslint-disable-line no-underscore-dangle
  const asyncContext = createAsyncContext();
  const app = (
    <AppContainer>
      <AsyncComponentProvider
        rehydrateState={rehydrateState}
        asyncContext={asyncContext}
      >
        <ApolloProvider client={apolloClient} store={store}>
          <Root>
            <ConnectedRouter
              key={module.hot ? new Date() : undefined}
              history={history}
            >
              {routes}
            </ConnectedRouter>
          </Root>
        </ApolloProvider>
      </AsyncComponentProvider>
    </AppContainer>
  );
  await asyncBootstrapper(app);
  ReactDOM.render(app, $root);
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept(() => {
      ReactDOM.render(app, $root);
    });
  }
}

startApp();
