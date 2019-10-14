exports.up = function(connection) {
  console.log("creating articles table");
  return connection.schema.createTable("articles", table => {
    table.increments("article_id").primary();
    table.int("topic_id").references("topic.topic_id");
    table.int("author").references("users.username");
    table.string("article_body").notNullable();
    table.datetime("created_at").notNullable();
  });
};

// problem with dates is in here - Cameron said I'll love it and it's a low blow, so get your jockstrap ready

exports.down = function(connection) {
  console.log("removing articles table");
  return connection.schema.dropTable("articles");
};
