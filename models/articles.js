const connection = require("../db/connection");

exports.fetchArticleById = ({ article_id }) => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "articles.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id");
};

exports.updateArticleById = ({ body, params }) => {
  return connection("articles")
    .where("article_id", "=", `${params.article_id}`)
    .increment("votes", `${body.inc_votes}`)
    .returning("*");
};

exports.insertNewComment = ({ body, params }) => {
  return connection("comments")
    .where("article_id", "=", `${params.article_id}`)
    .insert({
      article_id: `${params.article_id}`,
      author: `${body.username}`,
      body: `${body.body}`
    })
    .returning(["body", "comment_id", "author", "article_id", "votes"]);
};

exports.fetchAllComments = ({
  article_id,
  sort_by = "created_at",
  order_by = "desc"
}) => {
  return connection("comments")
    .select(["comment_id", "votes", "created_at", "body", "author"])
    .where("article_id", article_id)
    .orderBy(sort_by, order_by);
};
