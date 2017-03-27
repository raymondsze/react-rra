import { call, take, fork, put } from 'redux-saga/effects';
import {
  FETCH_MESSAGES_REQUESTED,
  FETCH_MESSAGES_SUCCEDED,
} from './constants';
import {
  fetchMessagesSucceded,
  changeLocale,
} from './actions';

export async function fetchMessages(locale) {
  return { locale };
}

export function* watchFetchMessagesSucceded() {
  const { locale, messages } = yield take(FETCH_MESSAGES_SUCCEDED);
  yield put(changeLocale(locale, messages));
}

export function* changeLocaleSaga() {
  while (true) { // eslint-disable-line
    const { locale } = yield take(FETCH_MESSAGES_REQUESTED);
    yield fork(watchFetchMessagesSucceded);
    const messages = yield call(fetchMessages, locale);
    yield put(fetchMessagesSucceded(locale, messages));
  }
}

export default [
  changeLocaleSaga,
];

