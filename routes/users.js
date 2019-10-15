const usersRouter = require("express").Router();
const { getUsersByUsername } = require("../controllers/users.js");

usersRouter.get("/:username", getUsersByUsername);

module.exports = usersRouter;
