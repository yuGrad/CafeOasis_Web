const { RedisClient } = require("../db/redis_db");

const RandomToken = {
	async create(email, type, token, verified, ttl = 600) {
		await RedisClient.set(
			email,
			JSON.stringify({ type: type, code: token, verified: verified }),
			{ EX: ttl }
		);
	},

	async findByEmail(email) {
		const result = await RedisClient.get(email);
		return result ? JSON.parse(result) : null;
	},

	async deleteByEmail(email) {
		await RedisClient.del(email);
	},
};

module.exports = RandomToken;
