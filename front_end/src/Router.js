import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './App';
import Sales from "./Components/Sales"
import Create from "./Components/Sales/Create"
import Show from "./Components/Sales/Show"

const AppRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/create" render={(props) => <Create {...props} />} />
      <Route path="/large" render={(props) => <Sales {...props} category="big" />} />
      <Route path="/small" render={(props) => <Sales {...props} category="small" />} />
      <Route path="/sales/:saleId" component={Show} />
    </Switch>
  </Router>
);

export default AppRouter;