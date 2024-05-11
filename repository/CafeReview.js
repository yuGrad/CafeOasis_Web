const { ObjectId } = require("mongodb");
const db = require("../db/mongo_db");
const { collection } = require("./Cafe");

const CafeReview = {
  collection: "cafe_reviews",
  async getCafeReviewsById(cafe_id) {
    const queryJson = { cafe_id: new ObjectId(cafe_id) };
    const reviews = await db.query(this.collection, "find", queryJson);

    return reviews;
  },
  async insertCafeReview(cafe_id, reviewer, content, starring) {
    const queryJson = {
      cafe_id: new ObjectId(cafe_id),
      reviewer: reviewer,
      content: content,
      starring: starring,
      date: new Date(),
      likes: 0,
    };

    await db.query(this.collection, "insert", queryJson);
  },
  updateLikeCnt(review_id) {
    const queryJson = {
      _id: new ObjectId(review_id),
    };
  },
};

module.exports = CafeReview;
