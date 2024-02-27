const mysql_config = {
  host: "localhost",
  user: "dudu",
  password: "aa1541",
  database: "oasis",
  connectionLimit: 5,
  charset: "utf8mb4",
};

const mongo_uri = "mongodb://dudu:aa1541@0.0.0.0:27017";

module.exports = { mysql_config, mongo_uri };
