const CafeReview = require("../repository/CafeReview");
const Cafe = require("../repository/Cafe");
const CafeCache = require("../repository/CafeCache");

const cafeReviewService = {
	async findReviewsByCafeId(cafe_id, pageNum) {
		try {
			const reviews = await CafeReview.getCafeReviewsByCafeId(cafe_id, pageNum);
			return reviews;
		} catch {
			throw new Error("Invalid Error");
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
	async increaseLikeCnt(reviewId, email) {
		try {
			const result = await CafeReview.increaseLikeCnt(reviewId, email, 1);
			if (result.modifiedCount > 0) return true;
			else return false;
		} catch (err) {
			throw new Error("email or review_id that does not exist");
		}
	},
	async findCustomerMyReviews(email) {
		try {
			return await CafeReview.findReviewsByReviewerEmail(email);
		} catch {
			throw new Error("Invalid Error");
		}
	},
	async findCustomerMyLikedReviews(email) {
		try {
			const reviews = await CafeReview.findReviewsByLikedEmail(email);
			const cafeIds = [...new Set(reviews.map((r) => r.cafe_id.toString()))];
			const cachedCafes = await CafeCache.getCafesByIds(cafeIds);

			const { found: cachedMap, missing: missingIds } = cafeIds.reduce(
				(result, cafeId, idx) => {
					const cachedCafe = cachedCafes[idx];
					if (cachedCafe) {
						result.found[cafeId] = cachedCafe;
					} else {
						result.missing.push(cafeId);
					}
					return result;
				},
				{ found: {}, missing: [] }
			);
			let cafeMap;
			if (missingIds.length) {
				const cafes = await Cafe.findCafesByIds(missingIds);
				cafeMap = cafes.reduce((map, cafe) => {
					map[cafe._id.toString()] = cafe;
					return map;
				}, cachedMap);
				await CafeCache.setCafesByIds(missingIds, cafes);
			} else cafeMap = cachedMap;

			return reviews.reduce((result, review) => {
				const cafeInfo = cafeMap[review.cafe_id.toString()];
				if (cafeInfo) {
					result.push({
						...review,
						cafe_info: { cafe_name: cafeInfo.cafe_name },
					});
				}
				return result;
			}, []);
		} catch (err) {
			console.error(err);
			throw new Error("Invalid Error");
		}
	},
};

module.exports = cafeReviewService;
