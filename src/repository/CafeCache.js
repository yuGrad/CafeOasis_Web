const { RedisClient } = require("../db/redis_db");

const CafeCache = {
	async getCafeById(id) {
		const result = await RedisClient.get(id);
		return result ? JSON.parse(result) : null;
	},

	async getCafesByIds(ids) {
		if (ids.length === 0) return null;
		const results = await RedisClient.mGet(ids);
		return results.map((result) => {
			return result ? JSON.parse(result) : null;
		});
	},

	async setCafeById(id, cafe, ttl = 3600) {
		delete cafe.bookmark_users;
		await RedisClient.set(id, JSON.stringify(cafe), { EX: ttl });
	},
	async setCafesByIds(ids, cafes, ttl = 3600) {
		const keyValues = {};
		cafes.forEach((cafe, idx) => {
			delete cafe.bookmark_users;
			keyValues[ids[idx]] = JSON.stringify(cafe);
		});

		await RedisClient.mSet(keyValues);
	},
};

module.exports = CafeCache;
