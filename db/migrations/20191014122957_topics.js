exports.up = function(connection) {
    console.log("creating topics table");
    return connection.schema.createTable("topics", table => {
      table.increments("topic_id").primary();
      table.string("slug").notNullable();
      table.string("description");
    });
  };
  
  exports.down = function(connection) {
    console.log("removing topics table");
    return connection.schema.dropTable("topics");
  };
