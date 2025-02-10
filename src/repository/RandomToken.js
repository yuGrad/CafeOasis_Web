const db = require("../db/mysql_db");

const RandomToken = {
	insertRandomToken(email, type, token, expiration, callback) {
		const sql =
			"insert into RandomToken(email, type, token, expiration) values(?, ?, ?, ?)";
		const params = [email, type, token, expiration];

		db.asynQuery(sql, params, callback);
	},

	async getLatestByEmail(email) {
		const sql =
			"SELECT \
        id, token, (expiration + created_at) expiration_time \
      FROM RandomToken \
      WHERE \
        email = ? and verified = FALSE\
      ORDER BY created_at DESC \
      LIMIT 1";
		const params = [email];
		const [token] = await db.query(sql, params);

		return token;
	},

	updateAsVerified(id, callback) {
		const sql = "update RandomToken set verified = TRUE where id = ?";
		const params = [id];

		db.asynQuery(sql, params, callback);
	},
};

module.exports = RandomToken;
