const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const submitRouter = require("../src/app/routes/submit");
const app = express();
const serverless = require("serverless-http");

app.use(cors());
app.use(bodyParser.json());
app.use("/.netlify/functions/submit", submitRouter.router);

module.exports.handler = serverless(app);
