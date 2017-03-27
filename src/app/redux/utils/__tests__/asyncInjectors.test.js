import { put } from 'redux-saga/effects';
import { createNetworkInterface } from 'apollo-client';
import configureStore from '~/app/redux/store';
import createApolloClient from '~/app/redux/apolloClient';
import {
  injectAsyncReducer,
  injectAsyncSagas,
} from '~/app/redux/utils/asyncInjectors';

const initialState = {};
const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'TEST':
      return { ...state, reduced: action.payload };
    default:
      return state;
  }
};

function* testSaga() {
  yield put({ type: 'TEST', payload: 'reduced' });
}

const sagas = [
  testSaga,
];

describe('asyncInjectors', () => {
  let store;

  beforeAll(() => {
    store = configureStore({
      apolloClient: createApolloClient({
        networkInterface: createNetworkInterface({ uri: '/ignore' }),
      }),
    });
  });
  describe('injectAsyncReducer', () => {
    it('it should provide a function to inject a reducer', () => {
      injectAsyncReducer(store, 'test', reducer);
      const actual = store.getState().test;
      const expected = initialState;
      expect(actual).toEqual(expected);
    });

    it('should not assign reducer if already existing', () => {
      injectAsyncReducer(store, 'test', reducer);
      expect(store.asyncReducers.test.toString()).toEqual(reducer.toString());
    });
  });

  describe('injectAsyncSagas', () => {
    it('it should provide a function to inject a saga', () => {
      injectAsyncSagas(store, sagas);
      const actual = store.getState().test;
      const expected = { reduced: 'reduced' };
      expect(actual).toEqual(expected);
    });
    it('should not assign sagas if already existing', () => {
      injectAsyncReducer(store, 'test', reducer);
      expect(store.asyncReducers.test.toString()).toEqual(reducer.toString());
    });
  });
});
