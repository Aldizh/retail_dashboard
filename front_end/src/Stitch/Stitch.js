import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const APP_ID = 'stock_viewer-szhrv';

// 1. Initialize the app client
const app = Stitch.initializeAppClient(APP_ID);

// 2. Instatiate a RemoteMongoClient client and create a RemoteMongoDatabase object
//    for the 'todo' collection.
const db = app.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('users');

// 3. Create a RemoteMongoCollection for the `items` collection.
const items = db.collection('user');

export { app, items };
