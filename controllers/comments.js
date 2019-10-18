const {
  updateCommentById,
  deleteCommentById
} = require("../models/comments.js");

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req)
    .then(comment => {
      if (comment.length === 0) {
        next({ status: 404, msg: "path not found" });
      } else {
        res.status(200).send({ comment: comment[0] });
      }
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  deleteCommentById(req)
    .then(comment => {
      if (comment < 1) {
        next({ status: 404, msg: "item not found" });
      } else {
        res.status(204).send({ msg: `removed ${comment} item(s)` });
      }
    })
    .catch(next);
};
