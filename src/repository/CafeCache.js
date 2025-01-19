const { RedisClient } = require("../db/redis_db");

const CafeCache = {
	async getCafeById(id) {
		const result = await RedisClient.get(id);
		return result ? JSON.parse(result) : null;
	},

	async setCafeById(id, cafe, ttl = 3600) {
		await RedisClient.set(id, JSON.stringify(cafe), { EX: ttl });
	},
};

module.exports = CafeCache;
