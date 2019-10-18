const connection = require("../db/connection");

exports.updateCommentById = ({ body, params }) => {
  if (Object.keys(body).length === 0) {
    body.inc_votes = 0;
  }
  return connection("comments")
    .where("comment_id", "=", `${params.comment_id}`)
    .increment("votes", `${body.inc_votes}`)
    .returning("*");
};

exports.deleteCommentById = ({ params }) => {
  return connection("comments")
    .where("comment_id", "=", `${params.comment_id}`)
    .delete("")
    .then(response => {
      return response;
    });
};
