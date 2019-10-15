exports.up = function(connection) {
  return connection.schema.createTable("users", table => {
    table
      .string("username")
      .unique()
      .primary()
      .notNullable();
    table.string("name");
    table.string("avatar_url");
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("users");
};
