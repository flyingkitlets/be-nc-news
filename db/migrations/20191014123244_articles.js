exports.up = function(connection) {
    console.log("creating articles table");
    return connection.schema.createTable("articles", table => {
      table.increments("article_id").primary();
      table.int("topic_id").references('topic.topic_id');
      table.int("author_id").references('users.user_id');
      table.string("article_body").notNullable();
      table.datetime("created_at").notNullable();
    });
  };
  
  exports.down = function(connection) {
    console.log("removing articles table");
    return connection.schema.dropTable("articles");
  };
