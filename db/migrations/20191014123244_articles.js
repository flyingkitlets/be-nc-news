exports.up = function(connection) {
  console.log("creating articles table");

  return connection.schema.createTable("articles", table => {
    table.increments("article_id").primary();
    table.string("title").notNullable();
    table.text("body").notNullable();
    table
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    table.string("topic").references("topics.slug");
    table.string("author").references("users.username");
    table.datetime("created_at").defaultTo(connection.fn.now());
  });
};

exports.down = function(connection) {
  console.log("removing articles table");
  return connection.schema.dropTable("articles");
};
