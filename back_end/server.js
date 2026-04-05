const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const axios = require("axios");

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
require("dotenv").config() // to use process.env

const cp = require("cookie-parser")
const jwt = require("jsonwebtoken")

const PORT = process.env.PORT || 5001;

const app = express();

// for local development
app.use(cors({
  origin: ['http://localhost:3006', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Init Middleware
app.use(express.json({ extended: false })); // for put, post requests
app.use(cp()) // for authorization

// ES6 promises
mongoose.Promise = global.Promise;

// Connect to the database only when ATLAS_URI is provided.
// This allows local development without a MongoDB URI configured.
const atlasUri = process.env.ATLAS_URI;
if (atlasUri) {
  // connects our back end code with the database
  mongoose.connect(atlasUri, {});

  mongoose.connection
    .once("open", () => console.log("connected to the database"))
    .on("error", console.error.bind(console, "MongoDB connection error:"));
} else {
  console.warn('ATLAS_URI not set — skipping MongoDB connection (development mode).');
}

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// (optional) only made for logging
app.use(morgan("dev"));


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

// cookie verification middleware - protects all routes below
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// auth routes (public)
app.use("/auth", authRouter);

// Apply auth middleware to API routes
app.use('/api', authMiddleware);

// appends api to all server requests (after middleware)
app.use("/api", apiRouter);

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

// launch our backend into the specified port
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));
