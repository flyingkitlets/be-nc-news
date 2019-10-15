const { fetchAllTopics } = require("../models/topics.js");

getTopics = (req, res, next) => {
  fetchAllTopics(req.query)
    .then(topics => {
      res.status(200).send({ total_topics: topics.length, topics });
    })
    .catch(next);
};

module.exports = {
  getTopics
};
