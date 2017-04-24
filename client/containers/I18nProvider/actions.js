import {
  CHANGE_LOCALE,
  FETCH_MESSAGES_REQUESTED,
  FETCH_MESSAGES_SUCCEDED,
} from './constants';

export function fetchMessagesRequested(locale) {
  return {
    type: FETCH_MESSAGES_REQUESTED,
    locale,
  };
}

export function fetchMessagesSucceded(locale, messages) {
  return {
    type: FETCH_MESSAGES_SUCCEDED,
    locale,
    messages,
  };
}

export function changeLocale(locale, messages) {
  return {
    type: CHANGE_LOCALE,
    locale,
    messages,
  };
}
