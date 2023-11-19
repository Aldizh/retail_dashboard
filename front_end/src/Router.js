import * as React from 'react';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import Dashboard from './App';
import Sales from "./Components/Sales"
import Create from "./Components/Sales/Create"
import Show from "./Components/Sales/Show"

const Router = (props) => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
      <Route
        exact
        path="/create"
        render={(innerProps) => <Create {...innerProps} />}
      />
      <Route
        exact
        path="/large"
        render={(innerProps) => <Sales {...innerProps} category={"big"} />}
      />
      <Route
        exact
        path="/small"
        render={(innerProps) => <Sales {...innerProps} category={"small"} />}
      />
      <Route path="/sales/:saleId" component={Show} />
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
