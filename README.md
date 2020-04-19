# Inventory and Sales Manager

_A full stack application using React JS for the front end, Node JS for the back end and Mongo DB_

## Setup

1. Make sure [Node](https://nodejs.org/en/download/) is at v16.13.1 or above.
2. Make sure to to whitelist your IP before starting the project.
3. If yarn install fails run following command to bypass the browser restriction.

```
npm config set strict-ssl false
```

4. Change the proxy to the following when working on development

```
"proxy": "http://localhost:5001"
```

4. Starting the app in a development environment (starts both server and client simultaneously)

```
yarn start:dev
```

5. Starting the app in production environment

```
NODE_ENV=production yarn start
```

6. Install mongodb client and start the daemon in order to run the test suite

```
brew install mongodb-community@4.4
mongod --dbpath /usr/local/var/mongodb
```

7. In order to debug jest tests put a debugger statement in the test you are working with and run the following

```
node --debug-brk --inspect ./node_modules/.bin/jest -i --env jest-environment-node-debug
```

This will output a link which you can paste into the browser and start the debugger 8. Setup [git hooks](docs/setup.md#git-hooks) to keep the docs updated.

## Package maintenance

Some helpful yarn tools to maintain dependencies

- For checking any security flaws with past versions
  ```
  yarn audit
  ```
- To automatically fix some outdated packages:
  ```
  yarn audit:fix
  ```
- To manually fix try adding the newer version of the related package and test the app, if no breaking changes run
  ```
  yarn add package@new_version
  ```
- Be sure to commit `yarn.lock` file to help other collaborators

## Learn

- [React](https://reactjs.org/)
- [Node](https://nodejs.org/en/docs/)
- [MongoDB](https://docs.mongodb.com/manual/introduction)

## \*Note: To connect to the live DB make sure to whitelist your public IP