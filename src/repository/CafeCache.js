const { RedisClient } = require("../db/redis_db");

const CafeCache = {
	async getCafeById(id) {
		const result = await RedisClient.get(id);
		return result ? JSON.parse(result) : null;
	},

	async getCafesByIds(ids) {
		const results = await RedisClient.mGet(ids);
		return results.map((result) => {
			return result ? JSON.parse(result) : null;
		});
	},

	async setCafeById(id, cafe, ttl = 3600) {
		await RedisClient.set(id, JSON.stringify(cafe), { EX: ttl });
	},
};

module.exports = CafeCache;
