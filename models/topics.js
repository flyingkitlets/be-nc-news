const connection = require("../db/connection");

exports.fetchAllTopics = ({ sort_by = "slug", order_by }) => {
  return connection
    .select("*")
    .from("topics")
    .orderBy(sort_by, order_by);
};
