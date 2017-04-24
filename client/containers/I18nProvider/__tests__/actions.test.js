import {
  changeLocale,
  fetchMessagesRequested,
  fetchMessagesSucceded,
} from '~/app/containers/I18nProvider/actions';

import {
  CHANGE_LOCALE,
  FETCH_MESSAGES_REQUESTED,
  FETCH_MESSAGES_SUCCEDED,
} from '~/app/containers/I18nProvider/constants';

describe('I18NProvider actions', () => {
  describe('FETCH_MESSAGES_REQUESTED', () => {
    it('has a type of FETCH_MESSAGES_REQUESTED', () => {
      const expected = {
        type: FETCH_MESSAGES_REQUESTED,
        locale: 'zh',
      };
      expect(fetchMessagesRequested('zh')).toEqual(expected);
    });
  });
  describe('FETCH_MESSAGES_SUCCEDED', () => {
    it('has a type of FETCH_MESSAGES_SUCCEDED', () => {
      const expected = {
        type: FETCH_MESSAGES_SUCCEDED,
        locale: 'zh',
        messages: {
          test: 'test',
        },
      };
      expect(fetchMessagesSucceded('zh', { test: 'test' })).toEqual(expected);
    });
  });
  describe('CHANGE_LOCALE', () => {
    it('has a type of CHANGE_LOCALE', () => {
      const expected = {
        type: CHANGE_LOCALE,
        locale: 'zh',
        messages: {
          test: 'test',
        },
      };
      expect(changeLocale('zh', { test: 'test' })).toEqual(expected);
    });
  });
});
