import { createNetworkInterface } from 'apollo-client';
import configureStore from '_client/redux/store';
import createApolloClient from '_client/redux/apolloClient';

describe('configureStore', () => {
  let store;

  beforeAll(() => {
    store = configureStore({
      apolloClient: createApolloClient({
        networkInterface: createNetworkInterface({ uri: '/ignore' }),
      }),
    });
  });

  describe('apolloClient', () => {
    it('should contain an object for apolloClient', () => {
      expect(typeof store.apolloClient).toBe('object');
    });
  });

  describe('asyncReducers', () => {
    it('should contain an object for async reducers', () => {
      expect(typeof store.asyncReducers).toBe('object');
    });
  });

  describe('runSaga', () => {
    it('should contain a hook for `sagaMiddleware.run`', () => {
      expect(typeof store.runSaga).toBe('function');
    });
  });

  describe('asyncTasks', () => {
    it('should contain an object for async tasks', () => {
      expect(typeof store.asyncTasks).toBe('object');
    });
  });
});
