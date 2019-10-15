exports.up = function(connection) {
    return connection.schema.createTable("comments", table => {
      table.increments("comment_id").primary();
      table.string("author").references('users.username');
      table.integer("article_id").references('articles.article_id');
      table.text("body").notNullable();
      table.datetime("created_at").defaultTo(connection.fn.now());
      table.integer("votes").defaultTo(0);
    });
  };
  
  exports.down = function(connection) {
    return connection.schema.dropTable("comments");
  };
