const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticleById
} = require("../controllers/articles.js");
const { send405Error } = require("../errors/error-handlers");

articlesRouter
  .get("/:article_id", getArticlesById)
  .patch("/:article_id", patchArticleById)
  .all("/:article_id", send405Error);

module.exports = articlesRouter;
