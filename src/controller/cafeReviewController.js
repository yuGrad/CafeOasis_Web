const cafeReviewService = require("../service/cafeReviewService");

const cafeReviewController = {
	getCafeReviewsByCafeId: async (req, res) => {
		const cafe_id = req.params.cafe_id;
		const pageNum = req.query.pageNum;

		if (pageNum <= 0) return res.sendStatus(400);
		const reviews = await cafeReviewService.findReviewsByCafeId(
			cafe_id,
			pageNum
		);
		if (reviews.length == 0) return res.sendStatus(404);

		res.status(200).json(reviews);
	},

	patchCafeReviewLikeCnt: async (req, res) => {
		const review_id = req.params.review_id;

		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });
		try {
			const result = await cafeReviewService.addLikeToReview(
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
			res.status(201).json({ message: "", data: {} });
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

module.exports = cafeReviewController;
