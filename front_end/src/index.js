import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import Router from './Router';
import NavBar from './NavBar';
import Footer from './Footer';
import {
  isLoggedIn,
  loginAnonymous,
  loginWithKey,
  logoutUser,
} from "./Realm"
import Login from "./Login"
import * as serviceWorker from "./serviceWorker"
import "./index.css"

export const history = createBrowserHistory();

class MyApp extends React.Component {
  state = { data: [] }

  render() {
    return isLoggedIn() ? (
      <>
        <NavBar handleLogout={logoutUser} isLoggedIn={isLoggedIn} /><br />
        <Router history={history}/>
        <Footer />
      </>
    ) : (
      <>
        <NavBar handleLogout={logoutUser} isLoggedIn={isLoggedIn} />
        <br />
        <Login loginAnonymous={loginAnonymous} loginWithKey={loginWithKey} />
        <Footer />
      </>
    );
  }
}

ReactDOM.render(<MyApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register()
