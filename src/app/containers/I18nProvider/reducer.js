import {
  DEFAULT_LOCALE,
  CHANGE_LOCALE,
} from '~/app/containers/I18nProvider/constants';

const initialState = {
  locale: DEFAULT_LOCALE,
  messages: {
    [DEFAULT_LOCALE]: {},
  },
};

function i18nProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return {
        ...state,
        locale: action.locale,
        messages: {
          ...state.messages,
          [action.locale]: action.messages || {},
        },
      };
    default:
      return state;
  }
}

export default i18nProviderReducer;
