const apiRouter = require("express").Router();
const topicsRouter = require("./topics.js");
const usersRouter = require("./users.js");
const articlesRouter = require("./articles.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
