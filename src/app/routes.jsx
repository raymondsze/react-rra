import React from 'react';
import { Route, Switch } from 'react-router';
import { asyncComponent } from 'react-async-component';

const routes = (
  <Switch>
    <Route
      path="/"
      component={asyncComponent({
        resolve: () => import('~/app/containers/DemoScene'),
      })}
    />
  </Switch>
);

export default routes;
