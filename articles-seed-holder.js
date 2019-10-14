
exports.up = function(connection) {
    console.log("creating articles table");
    return connection.schema.createTable("articles", table => {
      table.increments("topic_id").primary();
      table.integer("topic_id").references("topics.topic_id");
      table.string("article_title").notNullable();
    });
  };
  
  exports.down = function(connection) {};
  