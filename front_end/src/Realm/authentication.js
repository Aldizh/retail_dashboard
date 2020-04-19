import * as Realm from "realm-web";

import { app } from "./"

// const key = new UserApiKeyCredential("5c9cfd634da69303ebaf53d4")

// Log in a user with the specified email and password
// Note: The user must already be registered with the Realm app.
// See https://docs.mongodb.com/Realm/authentication/userpass/#create-a-new-user-account
export async function loginEmailPassword(email, password) {
  // Create an email/password credential
  const credentials = Realm.Credentials.emailPassword(email, password);
  // Authenticate the user
  const user = await app.logIn(credentials);
  // `App.currentUser` updates to match the logged in user
  console.assert(user.id === app.currentUser.id);
  return user;
}

// Log in a user anonymously.
// Note: When the user logs out, all data is lost.
// See https://docs.mongodb.com/Realm/authentication/anonymous/
export async function loginAnonymous() {
  // Create an anonymous credential
  const credentials = Realm.Credentials.anonymous();
  // Authenticate the user
  const user = await app.logIn(credentials);
  // `App.currentUser` updates to match the logged in user
  console.assert(user.id === app.currentUser.id);
  return user;
}

// Log in a user using API key
// TO DO: In production we need to make sure this is moved to a config file
export async function loginWithKey(apiKey) {
  // Create an API Key credential
  const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_API_KEY);
  // Authenticate the user
  const user = await app.logIn(credentials);
  // `App.currentUser` updates to match the logged in user
  console.assert(user.id === app.currentUser.id);
  return user;
}

export function hasLoggedInUser() {
  return app.auth.isLoggedIn
}

export function getAllUsers() {
  // Return a list of all users that are associated with the app
  return app.auth.listUsers()
}

export async function logoutUser() {
  // aletrnative way to fetch instance
  // const appInstance = Realm.App.getApp("stock_viewer-szhrv");
  
  // Log a user out of the app. Logged out users are still associated with
  // the app and will appear in the result of app.auth.listUsers()
  const userId = Object.keys(app.allUsers)[0]
  const user = app.allUsers[userId]
  await user.logOut();
  await app.removeUser(user)

  window.location = "/" // redirect home
}

export function isLoggedIn() { return app.users.length }

export { app }