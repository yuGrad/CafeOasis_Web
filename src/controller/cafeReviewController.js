const cafeReviewService = require("../service/cafeReviewService");
const CafeReview = require("../repository/CafeReview");

const cafeController = {
	getCafeReviewsByCafeId: async (req, res) => {
		const cafe_id = req.params.cafe_id;
		const reviews = await CafeReview.getCafeReviewsById(cafe_id);

		res.status(200).json(reviews);
	},

	patchCafeReviewLikeCnt: async (req, res) => {
		const review_id = req.params.review_id;

		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });
		try {
			const result = await cafeReviewService.increaseLikeCnt(
				review_id,
				req.session.login.email
			);

			if (result) res.sendStatus(200);
			else res.status(409).json({ message: "EMAIL ALREADY INCLUDED" });
		} catch (err) {
			res.status(400).json({ message: "EMAIL OR REVIEW NOT EXISTS" });
		}
	},

	postCafeReview: async (req, res) => {
		const { cafe_id, content, starring } = req.body;

		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });
		try {
			await cafeReviewService.registerCafeReview(
				cafe_id,
				req.session.login.email,
				content,
				starring
			);
			res.sendStatus(200);
		} catch (err) {
			console.log(err.message);
			res.status(400).json({ message: err.message });
		}
	},

	deleteCafeReview: async (req, res) => {
		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });

		try {
			const email = req.session.login.email;
			const { cafe_id, review_id } = req.params;

			await cafeReviewService.removeCafeReview(cafe_id, review_id, email);
			res.sendStatus(200);
		} catch (err) {
			console.log(err.message);
			res.status(400).json({ message: err.message });
		}
	},
};

module.exports = cafeController;
