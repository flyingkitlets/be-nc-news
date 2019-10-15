exports.up = function(connection) {

  return connection.schema.createTable("topics", table => {
    table
      .string("slug")
      .notNullable()
      .unique()
      .primary();
    table.string("description");
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("topics");
};
