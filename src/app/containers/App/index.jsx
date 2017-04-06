import 'sanitize.css/sanitize.css';
import 'semantic-ui-css/semantic.min.css';
import 'flexboxgrid/dist/flexboxgrid.css';
import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router';
import { asyncComponent } from 'react-async-component';
import styled from 'styled-components';
import Layout from '~/app/containers/Layout';
import I18nProvider from '~/app/containers/I18nProvider';
import UserProvider from '~/app/containers/UserProvider';
import AsyncIndexRoute from '~/app/containers/IndexScene/async';

const StyledMain = styled.main`
  @import url('https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic');

  font-size: 14px;
  font-weight: 100;
  color: rgba(0, 0, 0, 0.541176);
  font-family: Roboto, sans-serif;

  *:focus {
    outline: none;
  }
`;

class RootContainer extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <UserProvider>
        <I18nProvider>
          <StyledMain>
            <Layout>
              <Switch>
                <Route
                  path="/"
                  component={AsyncIndexRoute}
                />
              </Switch>
            </Layout>
          </StyledMain>
        </I18nProvider>
      </UserProvider>
    );
  }
}

export default RootContainer;
