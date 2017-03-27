import { PureComponent, PropTypes } from 'react';

class UserProvider extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.element.isRequired,
  };
  render() {
    const { children } = this.props;
    return children;
  }
}

export default UserProvider;
