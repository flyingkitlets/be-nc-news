const commentsRouter = require("express").Router();
const { patchCommentById, removeCommentById } = require("../controllers/comments.js");
const { send405Error } = require("../errors/error-handlers");

commentsRouter
  .patch("/:comment_id", patchCommentById)
  .delete('/:comment_id', removeCommentById)
  .all("/:comment_id", send405Error);

module.exports = commentsRouter;
