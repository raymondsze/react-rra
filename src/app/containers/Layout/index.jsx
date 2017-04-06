import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Header from './Header';
import favicon from './favicon.png';

class Layout extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.element.isRequired,
  };
  render() {
    const { children } = this.props;
    return (
      <section>
        <Helmet>
          <link rel="icon" type="image/png" href={favicon} />
        </Helmet>
        <Header />
        {children}
      </section>
    );
  }
}

export default Layout;
