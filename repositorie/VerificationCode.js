const db = require("../db/mysql_db");

const VerificationCode = {
  async insertVerificationCode(email, verification_code, expiration) {
    const sql =
      "insert into VerificationCode(email, verification_code, expiration) value(?, ?, ?)";
    const params = [email, verification_code];

    await db.query(sql, params);
  },
  async getVerificationCode(email) {
    const sql =
      "select id, verification_code, (expiration + created_at) expiration_time from VerificationCode where email = ? and verified = FALSE;";
    const parmas = [email];
    const [verificationCode] = await db.query(sql, parmas);

    return verificationCode;
  },
  updateCodeAsVerified(id, callback) {
    const sql = "update VerificationCode set expiration = TRUE where id = ?";
    const params = [id];

    db.asynQuery(sql, params, callback);
  },
};

module.exports = VerificationCode;
