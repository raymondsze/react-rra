import React from 'react';
import { shallow, mount } from 'enzyme';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Provider } from 'react-redux';
import { createNetworkInterface } from 'apollo-client';
import configureStore from '~/app/redux/store';
import createApolloClient from '~/app/redux/apolloClient';
import ConnectedI18NProvider, { I18NProvider } from '~/app/containers/I18nProvider/index';

const messages = defineMessages({
  someMessage: {
    id: 'some.id',
    defaultMessage: 'This is some default message',
    en: 'This is some en message',
  },
});

describe('<I18NProvider />', () => {
  it('should render its children', () => {
    const children = (<h1>Test</h1>);
    const renderedComponent = shallow(
      <I18NProvider messages={messages} locale="en" fetchMessages={() => null}>
        {children}
      </I18NProvider>,
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});


describe('<ConnectedI18NProvider />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({
      apolloClient: createApolloClient({
        networkInterface: createNetworkInterface({ uri: '/ignore' }),
      }),
    });
  });

  it('should render the default language messages', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <ConnectedI18NProvider
          messages={{ 'some.id': 'test' }}
          locale="en"
        >
          <FormattedMessage {...messages.someMessage} />
        </ConnectedI18NProvider>
      </Provider>,
    );
    expect(renderedComponent.contains(<FormattedMessage {...messages.someMessage} />)).toBe(true);
  });
});
