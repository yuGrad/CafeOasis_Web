const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cafeController = require("../controller/cafeController");
const cafeReviewController = require("../controller/cafeReviewController");

// cafe controller
router.get("", cafeController.getCafeMain);

router.get("/search", cafeController.getCafesBySearch);

router.get("/:cafe_id", cafeController.getCafeById);

router.get("/reviews/:cafe_id", cafeReviewController.getCafeReviewsByCafeId);

router.patch(
	"/reviews/:review_id/likes",
	authMiddleware.authSession,
	cafeReviewController.patchCafeReviewLikeCnt
);

router.post(
	"/reviews/:cafe_id",
	authMiddleware.authSession,
	cafeReviewController.postCafeReview
);

router.delete(
	"/:cafe_id/reviews/:review_id",
	authMiddleware.authSession,
	cafeReviewController.deleteCafeReview
);

module.exports = router;
