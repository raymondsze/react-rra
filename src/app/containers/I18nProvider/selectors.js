import { createSelector } from 'reselect';

const selectLanguage = state => state.language;

const localeSelector = createSelector(
  selectLanguage,
  languageState => languageState.locale,
);

const messagesSelector = createSelector(
  localeSelector,
  selectLanguage,
  (locale, languageState) => languageState.messages[locale],
);

export {
  selectLanguage,
  localeSelector,
  messagesSelector,
};
