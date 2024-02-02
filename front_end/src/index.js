import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import Router from './Router';
import Footer from './Footer';
import {
  isLoggedIn,
  loginAnonymous,
  loginWithKey,
} from "./Realm"
import Login from "./Login"
import { ThemeProvider } from "./Themes/ThemeContext";
import store from './redux/store'
// import * as serviceWorker from "./serviceWorker"

export const history = createBrowserHistory();

class RetailDashboard extends React.Component {
  render() {
    return (
      <Provider store={store}>
        {isLoggedIn() ? (
          <ThemeProvider>
            <Router history={history} />
            <Footer />
          </ThemeProvider>
        ) : (
          <ThemeProvider>
            <Login loginAnonymous={loginAnonymous} loginWithKey={loginWithKey} />
            <Footer />
          </ThemeProvider>
        )
      }
      </Provider>
    )
  }
}

ReactDOM.render(<RetailDashboard />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register()
