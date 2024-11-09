const RedisStore = require("connect-redis").default;
const redis = require("redis");

const config = require("../../config");

const RedisClient = redis.createClient({
	url: config.redis_config.url,
});

RedisClient.connect().catch(console.error);

const redisStore = new RedisStore({
	client: RedisClient,
	prefix: "sess:",
});

module.exports = { RedisClient, RedisStore: redisStore };