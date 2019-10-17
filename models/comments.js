const connection = require("../db/connection");

exports.updateCommentById = ({ body, params }) => {
  return connection("comments")
    .where("comment_id", "=", `${params.comment_id}`)
    .increment("votes", `${body.inc_votes}`)
    .returning("*");
};

exports.deleteCommentById = ({ body, params }) => {
  return connection("comments")
    .where("comment_id", "=", `${params.comment_id}`)
    .delete("")
    .then(response => {
      return response;
    });
};
