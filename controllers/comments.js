const {
  updateCommentById,
  deleteCommentById
} = require("../models/comments.js");

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req)
    .then(response => {
      if (response.length === 0) {
        res.status(404).send({ msg: "path not found" });
      } else {
        res.status(200).send(response[0]);
      }
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  deleteCommentById(req)
    .then(response => {
      if (response < 1) {
        res.status(404).send({ msg: "item not found" });
      } else {
        res.status(204).send({ msg: `removed ${response} item(s)` });
      }
    })
    .catch(next);
};
