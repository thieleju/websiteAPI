const express = require("express");
const app = express();
const helmet = require("helmet");

// set dynamic env filename
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });

// secure express app
app.use(helmet());
// use cors
app.use(require("cors")());

const port = process.env.APP_PORT;

// middleware able to get requestors ip by req.ip
app.set("trust proxy", true);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// check if provided data is a valid json to catch unhandled errors
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({ status: "error", message: "Invalid request!" });
  }
});

// welcome message
app.use((res, req) => {
  res
    .status(200)
    .json({ status: "success", message: "Hello from the dockerAPI!" });
});

// include v1 api
app.use("/v1", require("./src/v1"));

// listen for requests on port
app.listen(port, () => {
  if (process.env.NODE_ENV == "production") {
    console.log("Running in production on port " + port);
  } else {
    console.log("Running in development mode on port " + port);
  }
});
