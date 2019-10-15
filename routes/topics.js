const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.js");
const { send405Error } = require("../errors/error-handlers");

topicsRouter.get("/", getTopics).all("/", send405Error);

module.exports = topicsRouter;
