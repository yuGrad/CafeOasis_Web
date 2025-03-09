const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const paramValidationMiddleware = require("../middleware/paramValidationMiddleware");
const cafeController = require("../controller/cafeController");
const cafeReviewController = require("../controller/cafeReviewController");

router.get("", cafeController.getCafeMain);

router.get(
	"/search",
	paramValidationMiddleware.pageNum,
	cafeController.getCafesBySearch
);

/**
 * @swagger
 * /cafes/nearby:
 *   get:
 *     summary: 주변 카페 찾기
 *     description: 사용자의 위치와 검색 반경을 기반으로 주변 카페 목록을 조회
 *     tags: [Cafes]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: 사용자의 위도 값
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: 사용자의 경도 값
 *       - in: query
 *         name: radius
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: 검색 반경 (1 ~ 5 km)
 *     responses:
 *       '200':
 *         description: 성공적으로 카페 목록을 조회
 *         content:
 *           application/json:
 *       '400':
 *         description: 잘못된 파라미터 값 (lat, lng, radius 값 확인)
 */
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
