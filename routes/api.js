const apiRouter = require("express").Router();
const topicsRouter = require("./topics.js");
const usersRouter = require("./users.js");
const articlesRouter = require("./articles.js");
const commentsRouter = require("./comments.js");
const { aboutApi } = require("../controllers/about.js");

apiRouter.get("/", aboutApi);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
