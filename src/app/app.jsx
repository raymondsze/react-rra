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
import App from '~/app/containers/App';
import { addLocaleData } from 'react-intl';
import areIntlLocalesSupported from 'intl-locales-supported';

// Add other language supports here
const LANGUAGE_SUPPORTS = JSON.parse(process.env.LANGUAGES);
const loadLocaleData = async () => {
  // only static path could let webpack dynamic import
  /* ********** Add Your Locale Data Here if LANGUAGE_SUPPORTS Changed ********** */
  await import('react-intl/locale-data/en').then(addLocaleData);
};

async function initIntl() {
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(LANGUAGE_SUPPORTS)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and replace the constructors with need with the polyfill's.
      const IntlPolyfill = require('intl'); // eslint-disable-line
      await loadLocaleData();
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl'); // eslint-disable-line
  }
}

async function startApp(TheApp) {
  await initIntl();
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
          <ConnectedRouter
            history={history}
          >
            <TheApp />
          </ConnectedRouter>
        </ApolloProvider>
      </AsyncComponentProvider>
    </AppContainer>
  );
  await asyncBootstrapper(app);
  ReactDOM.render(app, $root);
}

startApp(App);

/* istanbul ignore next */
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    startApp(require('./containers/App').default); // eslint-disable-line global-require
  });
}
