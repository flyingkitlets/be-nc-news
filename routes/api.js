const apiRouter = require("express").Router();
const topicsRouter = require("./topics.js");
const usersRouter = require("./users.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
