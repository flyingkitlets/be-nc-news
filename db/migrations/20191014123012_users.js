exports.up = function(connection) {
    console.log("creating users table");
    return connection.schema.createTable("users", table => {
      table.increments("user_id").primary();
      table.string("username").notNullable();
      table.string("name");
      table.string("avatar_url");
    });
  };
  
  exports.down = function(connection) {
    console.log("removing users table");
    return connection.schema.dropTable("users");
  };
