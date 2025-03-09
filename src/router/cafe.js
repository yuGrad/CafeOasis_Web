const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const paramValidationMiddleware = require("../middleware/paramValidationMiddleware");
const cafeController = require("../controller/cafeController");
const cafeReviewController = require("../controller/cafeReviewController");

// cafe controller
router.get("", cafeController.getCafeMain);

router.get(
	"/search",
	paramValidationMiddleware.pageNum,
	cafeController.getCafesBySearch
);

router.get("/nearby", cafeController.getCafesByNear);

router.get("/:cafe_id", cafeController.getCafeById);

router.get(
	"/reviews/:cafe_id",
	paramValidationMiddleware.pageNum,
	cafeReviewController.getCafeReviewsByCafeId
);

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
