import React, { PropTypes, PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fetchMessagesRequested } from '~/app/containers/I18nProvider/actions';
import { localeSelector, messagesSelector } from '~/app/containers/I18nProvider/selectors';

function mapStateToProps(state) {
  return {
    locale: localeSelector(state),
    messages: messagesSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMessages(locale) {
      return dispatch(fetchMessagesRequested(locale));
    },
  };
}

const connected = connect(mapStateToProps, mapDispatchToProps);

class I18NProvider extends PureComponent {
  static defaultProps = {
    locale: 'en',
    messages: {},
  };

  static propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.shape({}).isRequired,
    children: PropTypes.element.isRequired,

    fetchMessages: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { locale } = this.props;
    // to trigger api to fetch all the messages
    this.props.fetchMessages(locale);
  }

  render() {
    const { children, locale, messages } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages}>
        <div>
          <Helmet>
            <html lang={locale} />
          </Helmet>
          {children}
        </div>
      </IntlProvider>
    );
  }
}

export { I18NProvider };
export default connected(I18NProvider);

