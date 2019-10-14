exports.up = function(connection) {
    console.log("creating comments table");
    return connection.schema.createTable("comments", table => {
      table.increments("comment_id").primary();
      table.int("article_id").references('articles.article_id');
      table.int("author_id").references('users.user_id');
      table.string("comment_body").notNullable();
      table.datetime("created_at").notNullable();
      table.int("comment_votes").defaultTo(0);
    });
  };
  
  exports.down = function(connection) {
    console.log("removing comments table");
    return connection.schema.dropTable("comments");
  };
