import createReducer from '~/app/redux/reducers';

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer; // eslint-disable-line no-param-reassign
  store.replaceReducer(createReducer({
    apolloClient: store.apolloClient,
    asyncReducers: store.asyncReducers,
  }));
}

export function injectAsyncSagas(store, sagas) {
  store.asyncTasks =  // eslint-disable-line no-param-reassign
    [...store.asyncTasks, sagas.map(store.runSaga)];
}
