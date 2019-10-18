const usersRouter = require("express").Router();
const { getUsersByUsername } = require("../controllers/users.js");
const { send405Error } = require("../errors/error-handlers");

usersRouter
  .route("/:username")
  .get(getUsersByUsername)
  .all(send405Error);

module.exports = usersRouter;
