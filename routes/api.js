const apiRouter = require("express").Router();
const topicsRouter = require("./topics.js");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
