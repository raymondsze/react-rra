import { browserHistory } from 'react-router';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducers from './reducers';
import sagas from './sagas';

// composeEnahncers
/* eslint-disable no-underscore-dangle */
let composeEnhancers = compose;
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  /* istanbul ignore next */
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}
/* eslint-enable no-underscore-dangle */

// configure store
function configureStore({
  initialState = {},
  history = browserHistory,
  apolloClient,
}) {
  const reducers = createReducers({ apolloClient });
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = composeEnhancers(...[
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(apolloClient.middleware()),
    applyMiddleware(sagaMiddleware),
  ]);
  const store = createStore(reducers, initialState, middlewares);

  store.apolloClient = apolloClient;
  store.runSaga = sagaMiddleware.run.bind(sagaMiddleware);
  store.asyncReducers = {};
  store.asyncTasks = sagas.map(store.runSaga);
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then((reducerModule) => {
        const nextReducers = reducerModule.default({
          apolloClient,
          asyncReducers: store.asyncReducers,
        });
        store.replaceReducer(nextReducers);
      });
    });
  }
  return store;
}

export default configureStore;

