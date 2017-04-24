import { expectSaga, testSaga } from 'redux-saga-test-plan';
import {
  changeLocaleSaga,
  fetchMessages,
  watchFetchMessagesSucceded,
} from '~/app/containers/I18nProvider/sagas';

import {
  FETCH_MESSAGES_REQUESTED,
  FETCH_MESSAGES_SUCCEDED,
} from '~/app/containers/I18nProvider/constants';

describe('I18NProvider sagas', () => {
  describe('changeLocaleSaga', () => {
    it('integration test', () =>
      expectSaga(changeLocaleSaga)
        .put({ type: FETCH_MESSAGES_SUCCEDED, locale: 'en', messages: { locale: 'en' } })
        .dispatch({ type: FETCH_MESSAGES_REQUESTED, locale: 'en' })
        .run(),
    );
    it('unit test', () => {
      testSaga(changeLocaleSaga)
        .next()
        .take(FETCH_MESSAGES_REQUESTED)
        .next({ type: FETCH_MESSAGES_REQUESTED, locale: 'en' })
        .fork(watchFetchMessagesSucceded)
        .next()
        .call(fetchMessages, 'en')
        .next({ locale: 'en' })
        .put({ type: FETCH_MESSAGES_SUCCEDED, locale: 'en', messages: { locale: 'en' } })
        .next()
        .take(FETCH_MESSAGES_REQUESTED);
    });
  });
});
