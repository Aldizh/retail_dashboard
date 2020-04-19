import * as React from 'react';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import Dashboard from './App';

const Router = (props) => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
      <Route
        path="/dashboard"
        render={() => (
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={(innerProps) => (
                <Dashboard {...innerProps} />
              )}
            />
          </Switch>
        )}
      />
    </Switch>
  </BrowserRouter>
);

export default Router;
