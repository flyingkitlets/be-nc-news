const connection = require("../db/connection");

const { makeRefObj } = require("../db/utils/utils");

exports.fetchArticleById = ({ article_id }) => {
  let commentCount = 0;
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .then(comments => {
      commentCount = comments.length;
      return connection
        .select(
          "article_id",
          "author",
          "body",
          "created_at",
          "title",
          "topic",
          "votes"
        )
        .from("articles")
        .where("article_id", article_id);
    })
    .then(output => {
      const withCC = [];
      output.forEach(obj => {
        obj["comment_count"] = commentCount;
        withCC.push(obj);
      });
      return withCC;
    });
};

exports.updateArticleById = ({ body, params }) => {
  return connection("articles")
    .where("article_id", "=", `${params.article_id}`)
    .increment("votes", `${body.inc_votes}`)
    .returning("*");
};
