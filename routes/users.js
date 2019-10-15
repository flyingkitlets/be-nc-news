const usersRouter = require("express").Router();
const { getUsersByUsername } = require("../controllers/users.js");
const { send405Error } = require("../errors/error-handlers");

usersRouter.get("/:username", getUsersByUsername).all("/:username", send405Error);

module.exports = usersRouter;
