import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './App';
import Sales from "./Components/Sales"
import Create from "./Components/Sales/Create"
import Show from "./Components/Sales/Show"

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<Create />} />
      <Route path="/large" element={ <Sales category="big" />} />
      <Route path="/small" element={ <Sales category="small" />} />            
      <Route path="/sales">
        <Route path=":saleId" element={<Show />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;