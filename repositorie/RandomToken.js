const db = require("../db/mysql_db");

const RandomToken = {
  insertRandomToken(email, type, token, expiration, callback) {
    const sql =
      "insert into RandomToken(email, type, token, expiration) values(?, ?, ?)";
    const params = [email, type, token, expiration];

    db.asynQuery(sql, params, callback);
  },
};

module.exports = RandomToken;
