const commentsRouter = require("express").Router();
const {
  patchCommentById,
  removeCommentById
} = require("../controllers/comments.js");
const { send405Error } = require("../errors/error-handlers");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(removeCommentById)
  .all(send405Error);

module.exports = commentsRouter;
