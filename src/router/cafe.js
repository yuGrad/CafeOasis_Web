const express = require("express");
const router = express.Router();
const cafeController = require("../controller/cafeController");
const cafeReviewController = require("../controller/cafeReviewController");

// cafe controller
router.get("/:cafe_id", cafeController.getCafeById);

router.get("", cafeController.getCafesBySearch);

// cafe review controller
router.get("/reviews/:cafe_id", cafeReviewController.getCafeReviewsByCafeId);

router.patch(
	"/reviews/:review_id/likes",
	cafeReviewController.patchCafeReviewLikeCnt
);

router.post("/reviews/:cafe_id", cafeReviewController.postCafeReview);

router.delete(
	"/:cafe_id/reviews/:review_id",
	cafeReviewController.deleteCafeReview
);

router.get("/:cafe_id/bookmark", cafeController.getCafeBookmarkStatus);

router.put("/:cafe_id/bookmark", cafeController.toggleCafeBookmark);

module.exports = router;
