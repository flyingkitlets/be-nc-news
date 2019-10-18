const connection = require("../db/connection");
const { fetchUserByUsername } = require("../models/users");
const { checkTopicExists } = require("../models/topics");

exports.fetchArticleById = ({ article_id }) => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "articles.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id");
};

exports.updateArticleById = ({ body, params }) => {
  if (Object.keys(body).length === 0) {
    body.inc_votes = 0;
  }
  return connection("articles")
    .where("article_id", "=", `${params.article_id}`)
    .increment("votes", `${body.inc_votes}`)
    .returning("*");
};

exports.insertNewComment = ({ body, params }) => {
  return connection("articles")
    .select("article_id")
    .then(articles => {
      const allArticles = articles.map(article => {
        return article.article_id;
      });
      if (!allArticles.includes(+params.article_id)) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    })
    .then(() => {
      return connection("comments")
        .where("article_id", "=", `${params.article_id}`)
        .insert({
          article_id: `${params.article_id}`,
          author: `${body.username}`,
          body: `${body.body}`
        })
        .returning(["body", "comment_id", "author", "article_id", "votes"]);
    });
};

exports.fetchAllComments = (
  { article_id },
  { sort_by = "created_at", order_by = "desc" }
) => {
  const allowedValues = ["asc", "desc"];
  if (!allowedValues.includes(order_by)) {
    order_by = "desc";
  }
  return connection("articles")
    .select("article_id")
    .then(articles => {
      const allArticles = articles.map(article => {
        return article.article_id;
      });
      if (!allArticles.includes(+article_id))
        return Promise.reject({ status: 404, msg: "not found" });
    })
    .then(() => {
      return connection("comments")
        .select(["comment_id", "votes", "created_at", "body", "author"])
        .where("article_id", article_id)
        .orderBy(sort_by, order_by);
    });
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order_by = "desc",
  author,
  topic
}) => {
  const dbQuery = connection("articles")
    .select("articles.*")
    .orderBy(sort_by, order_by)
    .count({ comment_count: "articles.article_id" })
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) {
        query.where({ author });
      }
      if (topic) {
        query.where({ topic });
      }
    });
  const searchPromises = [dbQuery];
  const allowedValues = ["asc", "desc"];
  if (!allowedValues.includes(order_by)) {
    order_by = "desc";
  }
  if (author) {
    const authorPromise = fetchUserByUsername({ username: author }).then(
      ([user]) => {
        if (!user) {
          return Promise.reject({
            status: 404,
            msg: "bad request - user not found"
          });
        }
      }
    );
    searchPromises.push(authorPromise);
  }
  if (topic) {
    const topicPromise = checkTopicExists({ topic }).then(([slug]) => {
      if (!slug) {
        return Promise.reject({
          status: 404,
          msg: "bad request - topic not found"
        });
      }
    });
    searchPromises.push(topicPromise);
  }
  return Promise.all(searchPromises)
    .then(results => {
      return results[0];
    })
    .catch(rejection => {
      return Promise.reject(rejection);
    });
};
