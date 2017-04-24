import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import i18nProviderReducer from '_client/containers/I18nProvider/reducer';

// Create reducers, by default apollo, form, routing are supported
function createReducer({ apolloClient, asyncReducers }) {
  const reducers = combineReducers({
    language: i18nProviderReducer,
    routing: routerReducer,
    apollo: apolloClient.reducer(),
    form: formReducer,
    ...asyncReducers,
  });
  return reducers;
}

export default createReducer;
