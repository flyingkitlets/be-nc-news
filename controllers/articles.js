const {
  fetchArticleById,
  updateArticleById,
  insertNewComment
} = require("../models/articles.js");

getArticlesById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      if (article.length === 0) {
        res.status(404).send({ msg: "not found" });
      } else {
        res.status(200).send({ article: article[0] });
      }
    })
    .catch(next);
};

patchArticleById = (req, res, next) => {
  updateArticleById(req)
    .then(response => {
      if (response.length === 0) {
        res.status(404).send({ msg: "path not found" });
      } else {
        res.status(200).send(response[0]);
      }
    })
    .catch(next);
};

postNewComment = (req, res, next) => {
  insertNewComment(req)
    .then(response => {
      res.status(200).send(response[0]);
    })
    .catch(next);
};

module.exports = {
  getArticlesById,
  postNewComment,
  patchArticleById
};
