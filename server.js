const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const path = require("path");
const swaggerDocument = require("./openapi.json");

require("dotenv").config({ path: "./env/.env" });

const PORT = process.env.PORT || 4000;

const app = express();

// cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//middleware
app.use(bodyParser.json({limit: "20mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "20mb", extended: true}));
app.use(cors());


// mongodb connection
require("./src/database/connection");

// public routes

app.use("/v1", require("./src/routes/routes"));
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(PORT, function () {
  console.log("listening to port ", PORT);
});
