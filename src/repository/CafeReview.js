const { ObjectId } = require("mongodb");
const db = require("../db/mongo_db");

const CafeReview = {
	collection: "cafe_reviews",
	async findCafeReviewsByCafeId(cafe_id, pageNum, pageSize = 20) {
		const skip = (pageNum - 1) * pageSize;
		const pipeline = [
			{ $match: { cafe_id: new ObjectId(cafe_id) } },
			{ $skip: skip },
			{ $limit: pageSize },
			{ $project: { cafe_id: 0, like_users: 0 } },
		];
		const reviews = await db.query(this.collection, "aggregate", pipeline);

		return reviews;
	},
	async insertCafeReview(cafeId, reviewer, content, starring) {
		const queryJson = {
			cafe_id: new ObjectId(cafeId),
			reviewer: reviewer,
			content: content,
			starring: starring,
			date: new Date(),
			likes: 0,
			like_users: [],
		};
		const result = await db.query(this.collection, "insertOne", queryJson);

		return result;
	},
	async removeCafeReview(cafeId, reviewId, email) {
		const queryJson = {
			_id: new ObjectId(reviewId),
			cafe_id: new ObjectId(cafeId),
			reviewer: email, // 요청한 사용자 검증
		};
		const result = await db.query(this.collection, "deleteOne", queryJson);

		return result;
	},

	async updateReviewLike(reviewId, email, addedCnt) {
		const queryJson = {
			_id: new ObjectId(reviewId),
			like_users: { $ne: email },
		};
		const updateJson = {
			$inc: { likes: +addedCnt },
			$push: { like_users: email },
		};
		const result = await db.query(
			this.collection,
			"updateOne",
			queryJson,
			updateJson
		);

		return result;
	},

	async findReviewsByReviewerEmail(email) {
		const pipeline = [
			{
				$match: { reviewer: email },
			},
			{
				$lookup: {
					from: "cafes",
					localField: "cafe_id",
					foreignField: "_id",
					as: "cafe_info",
				},
			},
			{
				$unwind: "$cafe_info",
			},
			{
				$project: {
					cafe_id: 1,
					reviewer: 1,
					content: 1,
					date: 1,
					"cafe_info.cafe_name": 1,
				},
			},
		];
		const result = await db.query(this.collection, "aggregate", pipeline);

		return result;
	},

	async findReviewsByLikedEmail(email) {
		const queryJson = {
			like_users: email,
		};
		const result = await db.query(this.collection, "find", queryJson, {
			projection: { cafe_id: 1, reviewer: 1, content: 1, likes: 1, date: 1 },
		});

		return result;
	},
};

module.exports = CafeReview;
