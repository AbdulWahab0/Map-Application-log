const express = require("express");
const os = require("os");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/config");
const routes = require("./routes");
const fileUpload = require("express-fileupload");

const app = express();
app.use(fileUpload());

let server;
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.info("Connected to MongoDB");

  server = app.listen(process.env.PORT || 8080, () => {
    console.info(`Listening to port ${process.env.PORT || 8080}`);
  });
});

// Upload Endpoint
app.all("/uploadss", (req, res) => {
  console.log("req", req);
  console.log("res", res);
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.use("/api", routes);
app.get("/api/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username })
);

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
