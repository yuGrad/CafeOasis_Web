const { ObjectId } = require("mongodb");
const db = require("../db/mongo_db");

const CafeReview = {
  async getCafeReviewsById(cafe_id) {
    const queryJson = { cafe_id: new ObjectId(cafe_id) };
    const reviews = await db.query("cafe_reviews", "find", queryJson);

    return reviews;
  },
};

module.exports = CafeReview;
