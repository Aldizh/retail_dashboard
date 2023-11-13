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
import { ThemeProvider } from "./Themes/ThemeContext";
// import * as serviceWorker from "./serviceWorker"

export const history = createBrowserHistory();

class MyApp extends React.Component {
  render() {
    return isLoggedIn() ? (
      <ThemeProvider>
        <NavBar handleLogout={logoutUser} isLoggedIn={isLoggedIn} /><br />
        <Router history={history}/>
        <Footer />
      </ThemeProvider>
    ) : (
      <ThemeProvider>
        <NavBar handleLogout={logoutUser} isLoggedIn={isLoggedIn} />
        <br />
        <Login loginAnonymous={loginAnonymous} loginWithKey={loginWithKey} />
        <Footer />
      </ThemeProvider>
    );
  }
}

ReactDOM.render(<MyApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register()
