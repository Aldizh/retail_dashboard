const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const axios = require("axios");

const apiRouter = require("./routes/api");
require("dotenv").config() // to use process.env

const cp = require("cookie-parser")
const jwt = require("jsonwebtoken")

const PORT = process.env.PORT || 5001;

const app = express();

// for local development
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false })); // for put, post requests
app.use(cp()) // for authorization

// ES6 promises
mongoose.Promise = global.Promise;

// connects our back end code with the database
mongoose.connect(process.env.ATLAS_URI, {});

mongoose.connection
  .once("open", () => console.log("connected to the database"))
  .on("error", console.error.bind(console, "MongoDB connection error:"));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// (optional) only made for logging
app.use(morgan("dev"));

// appends api to all server requests
app.use("/api", apiRouter);

app.get("/reference/currencies", (req, res, next) => {
  const baseUrl = "http://api.exchangerate.host/latest?amount=1"
  const apiKey = process.env.CUREENCY_API_KEY
  axios(`${baseUrl}&symbols=USD,ALL&access_key=${apiKey}`)
    .then(({ data }) => {
      return res.json({ success: true, data })
    }).catch(err => {
      return res.status(400).json({ success: false, error: err})
    })
});

// fallback middleware to handle malformed requests
app.use(function(err, req, res, next) {
  console.log('err...', err)
  console.log('type err...', typeof err)
  res.status(422).send({ error: err.message });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../front_end/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front_end/build/index.html'));
})

// cookie verification middleware
app.use((req, res, next) => {
  const { token } = req.cookies

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log('hitting cookie verification...')
    if (payload.client === process.env.CLIENT_ID) next()
    else res.status(500).json({ success: false, msg: "Check the gcp client id"  })
  } catch (err) {
    res.clearCookie("token")
    return res.redirect("/login")
  }
})

// launch our backend into the specified port
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));
