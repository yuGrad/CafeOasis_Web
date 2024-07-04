const CafeReview = require("../repository/CafeReview");
const Cafe = require("../repository/Cafe");

const cafeReviewService = {
  async increaseLikeCnt(reviewId, email) {
    const review = await CafeReview.getCafeReviewByLikeUserId(reviewId, email);

    try {
      if (!review) {
        CafeReview.increaseLikeCnt(reviewId, email, 1);
        return true;
      } else return false;
    } catch (err) {
      throw new Error("email or review_id that does not exist");
    }
  },
  async registerCafeReview(cafeId, reviewer, content, starring) {
    if (!starring || starring < 0 || starring > 5 || !content)
      throw new Error("Invalid input value");
    const cafe = await Cafe.getCafeById(cafeId); // cafeId가 존재하는 cafe인지 검증
    if (!cafe) throw new Error("No exist cafe");

    await CafeReview.insertCafeReview(cafeId, reviewer, content, starring);
  },
  async removeCafeReview(cafeId, reviewId, email) {
    const result = await CafeReview.deleteCafeReview(cafeId, reviewId, email);

    if (result.deletedCount == 0) {
      throw new Error("You don't have permissions on that review");
    }
  },
};

module.exports = cafeReviewService;
