import React, { PureComponent, PropTypes } from 'react';
import Header from './Header';

class Layout extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.element.isRequired,
  };
  render() {
    const { children } = this.props;
    return (
      <section>
        <Header />
        {children}
      </section>
    );
  }
}

export default Layout;
