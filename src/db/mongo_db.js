const { MongoClient } = require("mongodb");
const config = require("../../config");

const mongoClient = new MongoClient(config.mongo_config.uri);

// MongoDB에 연결
async function connect() {
	await mongoClient.connect(); // 연결 시도
	return mongoClient.db(config.mongo_config.database); // 데이터베이스 반환
}

async function query(collection, operation, ...params) {
	const db = await connect();
	const col = db.collection(collection);

	// operation 예: find, insertOne, updateOne 등
	const result = await col[operation](...params);
	// find or aggregate 연산의 경우 결과를 배열로 변환
	if (operation === "find" || operation === "aggregate")
		return result.toArray();
	return result;
}

module.exports = { query };
