import i18nProviderReducer from '~/app/containers/I18nProvider/reducer';
import {
  CHANGE_LOCALE,
  DEFAULT_LOCALE,
} from '~/app/containers/I18nProvider/constants';

describe('I18NProvider reducer', () => {
  it('returns the initial state', () => {
    expect(i18nProviderReducer(undefined, {})).toEqual({
      locale: DEFAULT_LOCALE,
      messages: {
        [DEFAULT_LOCALE]: {},
      },
    });
  });

  it('changes the locale with messages', () => {
    expect(i18nProviderReducer(undefined, {
      type: CHANGE_LOCALE,
      locale: 'zh',
      messages: { test: 'test' },
    })).toEqual({
      locale: 'zh',
      messages: {
        [DEFAULT_LOCALE]: {},
        zh: { test: 'test' },
      },
    });
  });

  it('changes the locale without messages', () => {
    expect(i18nProviderReducer(undefined, {
      type: CHANGE_LOCALE,
      locale: 'zh',
    })).toEqual({
      locale: 'zh',
      messages: {
        [DEFAULT_LOCALE]: {},
        zh: {},
      },
    });
  });
});
