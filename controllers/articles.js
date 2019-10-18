const {
  fetchArticleById,
  updateArticleById,
  insertNewComment,
  fetchAllComments,
  fetchAllArticles
} = require("../models/articles.js");

getArticlesById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      if (article.length === 0) {
        next({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ article: article[0] });
      }
    })
    .catch(next);
};

getAllComments = (req, res, next) => {
  fetchAllComments(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

patchArticleById = (req, res, next) => {
  updateArticleById(req)
    .then(article => {
      if (article.length === 0) {
        next({ status: 404, msg: "path not found" });
      } else {
        res.status(200).send({ article: article[0] });
      }
    })
    .catch(next);
};

postNewComment = (req, res, next) => {
  insertNewComment(req)
    .then(article => {
      res.status(201).send({ comment: article[0] });
    })
    .catch(next);
};

module.exports = {
  getArticlesById,
  getAllComments,
  getAllArticles,
  postNewComment,
  patchArticleById
};
