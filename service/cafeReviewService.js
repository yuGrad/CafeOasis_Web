const CafeReview = require("../repository/CafeReview");

const cafeReviewService = {
  async increaseLikeCnt(reviewId, email) {
    const review = await CafeReview.getCafeReviewByLikeUserId(reviewId, email);

    try {
      if (review) {
        CafeReview.increaseLikeCnt(reviewId, email, 1);
        return true;
      } else return false;
    } catch (err) {
      throw new Error("email or review_id that does not exist");
    }
  },
};

module.exports = cafeReviewService;
