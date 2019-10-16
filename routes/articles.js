const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticleById,
  postNewComment,
  getAllComments
} = require("../controllers/articles.js");
const { send405Error } = require("../errors/error-handlers");

articlesRouter
  .get("/:article_id", getArticlesById)
  .patch("/:article_id", patchArticleById)
  .post("/:article_id/comments", postNewComment)
  .get("/:article_id/comments", getAllComments)
  .all("/:article_id/comments", send405Error)
  .all("/:article_id", send405Error);

module.exports = articlesRouter;
