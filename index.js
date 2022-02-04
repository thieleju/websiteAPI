const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

// set dynamic env filename
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });

const port = process.env.APP_PORT;
const origin = process.env.APP_CORS_ORIGIN;

// secure express app
app.use(helmet());

// use cors
app.use(
  cors({
    methods: ["GET", "POST"],
    origin: (orig, callback) => {
      if (orig == origin) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
  })
);

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
    res.status(400).json({
      status: "error",
      message: "Invalid request!",
      error: err.toString(),
    });
  }
});

// welcome message
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello " + req.ip + " from the websiteAPI!",
  });
});

// include v1 api
app.use("/v1", require("./routes/v1"));

// listen for requests on port
const server = app.listen(port, () => {
  if (process.env.NODE_ENV == "production") {
    console.log("Running in production on port " + port);
  } else {
    console.log("Running in development mode on port " + port);
  }
});

const io = require("socket.io")(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// add socket.io connection function
require("./sockets/connection")(io);
