const express = require("express");
const app = express();
const apiRouter = require("./routes/api.js");
const {
  customErrorHandling,
  handle500Errors
} = require("./errors/error-handlers");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(customErrorHandling);
app.use(handle500Errors);
app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
