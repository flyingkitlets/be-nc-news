const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticleById,
  postNewComment,
  getAllComments,
  getAllArticles
} = require("../controllers/articles.js");
const { send405Error } = require("../errors/error-handlers");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(send405Error);
articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleById)
  .all(send405Error);
articlesRouter
  .route("/:article_id/comments")
  .post(postNewComment)
  .get(getAllComments)
  .all(send405Error);

module.exports = articlesRouter;

// use .route('/')
