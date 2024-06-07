const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const submitRouter = require("./app/routes/submit");
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/submit", submitRouter.router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
