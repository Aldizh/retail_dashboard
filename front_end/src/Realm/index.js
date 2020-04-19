import * as Realm from "realm-web";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID });

import {
  isLoggedIn,
  loginAnonymous,
  loginWithKey,
  logoutUser,
} from "./authentication"

export { app, isLoggedIn, loginAnonymous, loginWithKey, logoutUser }
