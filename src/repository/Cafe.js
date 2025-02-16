const { ObjectId } = require("mongodb");
const db = require("../db/mongo_db");

const Cafe = {
	collection: "cafes",

	async findCafesByNameOrAddr(target, pageNum, pageSize) {
		const pipeline = [
			{
				$match: {
					$or: [
						{ cafe_name: { $regex: target, $options: "i" } },
						{ address: { $regex: target, $options: "i" } },
					],
				},
			},
			{ $skip: pageNum * pageSize },
			{ $limit: pageSize },
			{
				$project: {
					cafe_name: true,
					starring: true,
					phone_number: true,
					address: true,
					business_hours: true,
					image_link: true,
				},
			},
		];
		const cafes = await db.query(this.collection, "aggregate", pipeline);

		return cafes;
	},

	async findCafeById(cafe_id) {
		const queryJson = { _id: new ObjectId(cafe_id) };
		const cafe = await db.query(this.collection, "findOne", queryJson, {
			projection: {
				bookmark_users: false,
			},
		});

		return cafe;
	},

	findCafeBookmarkByCafeIdAndEmail(cafeId, email) {
		const query = {
			_id: new ObjectId(cafeId),
			bookmark_users: email,
		};

		return new Promise((resolve, reject) => {
			db.query(this.collection, "findOne", query).then(resolve).catch(reject);
		});
	},

	pushCafeBookmark(cafeId, email) {
		const query = {
			_id: new ObjectId(cafeId),
			bookmark_users: { $ne: email },
		};
		const updateJson = {
			$push: { bookmark_users: email },
		};

		return new Promise((resolve, reject) => {
			db.query(this.collection, "updateOne", query, updateJson)
				.then(resolve)
				.catch(reject);
		});
	},

	removeCafeBookmark(cafeId, email) {
		const query = {
			_id: new ObjectId(cafeId),
		};
		const updateJson = {
			$pull: { bookmark_users: email }, // bookmark_users 배열에서 email 제거
		};

		return new Promise((resolve, reject) => {
			db.query(this.collection, "updateOne", query, updateJson)
				.then(resolve)
				.catch(reject);
		});
	},

	async findBookmarksByEmail(email) {
		const query = {
			bookmark_users: email,
		};
		const projection = {
			cafe_name: true,
			starring: true,
			address: true,
		};

		return await db.query(this.collection, "find", query, {
			projection: projection,
		});
	},

	async findCafesByIds(cafeIds) {
		return await db.query(
			this.collection,
			"find",
			{ _id: { $in: cafeIds.map((cafeId) => new ObjectId(cafeId)) } },
			{
				projection: {
					bookmark_users: false,
				},
			}
		);
	},
};

module.exports = Cafe;
