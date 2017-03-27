import {
  selectLanguage,
  localeSelector,
  messagesSelector,
} from '~/app/containers/I18nProvider/selectors';

describe('I18NProvider selectors', () => {
  describe('selectLanguage', () => {
    it('should select the global state', () => {
      const globalState = {};
      const mockedState = {
        language: globalState,
      };
      expect(selectLanguage(mockedState)).toEqual(globalState);
    });
  });


  describe('localeSelector', () => {
    const mockedState = {
      language: {
        locale: 'en',
        messages: {
          en: {
            test: 'test',
          },
        },
      },
    };
    it('should select the locale', () => {
      expect(localeSelector(mockedState))
        .toEqual(mockedState.language.locale);
    });
  });

  describe('messagesSelector', () => {
    const mockedState = {
      language: {
        locale: 'en',
        messages: {
          en: {
            test: 'test',
          },
        },
      },
    };
    it('should select the messages', () => {
      expect(messagesSelector(mockedState))
        .toEqual(mockedState.language.messages.en);
    });
  });
});
