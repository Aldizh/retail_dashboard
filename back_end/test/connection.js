const mongoose = require("mongoose");
require('dotenv').config()

// ES6 Promises
mongoose.Promise = global.Promise;

before(function(done) {
  // connect to db before tests run
  mongoose.connect(process.env.TEST_DB_URI, {});
  mongoose.connection
    .once("open", function() {
      console.log("Connection made");
      done();
    })
    .on("error", function(error) {
      console.log("Connection error: ", error);
    });
});

// Drop the collection before each test
beforeEach(function(done) {
  mongoose.connection.collections.datas.drop(function() {
    done();
  });
});
