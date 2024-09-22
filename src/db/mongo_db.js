const { MongoClient } = require("mongodb");
const config = require("../../config");

let dbConnection = null;

// MongoDB에 연결
async function connect() {
	const mongoClient = new MongoClient(config.mongo_config.uri, {
		maxPoolSize: 10,
		minPoolSize: 5,
		maxIdleTimeMS: 30000,
		connectTimeoutMS: 5000,
	});

	if (!dbConnection) {
		await mongoClient.connect();
		dbConnection = mongoClient.db(config.mongo_config.database);
	} else {
		try {
			await dbConnection.command({ ping: 1 });
		} catch (error) {
			await mongoClient.connect();
			dbConnection = mongoClient.db(config.mongo_config.database);
		}
	}
	return dbConnection;
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
