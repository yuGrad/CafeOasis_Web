const db = require("../db/mysql_db");

const VerificationCode = {
  insertVerificationCode(email, verification_code, expiration, callback) {
    const sql =
      "insert into VerificationCode(email, verification_code, expiration) value(?, ?, ?)";
    const params = [email, verification_code, expiration];

    db.asynQuery(sql, params, callback);
  },
  async getVerificationCode(email) {
    const sql =
      "select \
        id, verification_code, (expiration + created_at) expiration_time \
      from VerificationCode \
      where \
        email = ? \
        and verified = FALSE \
      ORDER BY created_at DESC \
      LIMIT 1";
    const parmas = [email];
    const [verificationCode] = await db.query(sql, parmas);

    return verificationCode;
  },
  updateCodeAsVerified(id, callback) {
    const sql = "update VerificationCode set verified = TRUE where id = ?";
    const params = [id];

    db.asynQuery(sql, params, callback);
  },
};

module.exports = VerificationCode;
