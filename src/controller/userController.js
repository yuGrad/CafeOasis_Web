const userService = require("../service/userService");
const cafeService = require("../service/cafeService");
const cafeReviewService = require("../service/cafeReviewService");

const userController = {
	getMyPage: (req, res) => {
		res.render("mypage", { login: req.session.login });
	},

	getCafeBookmarked: (req, res) => {
		const cafeId = req.params.cafe_id;
		const email = req.session?.login.email;

		userService
			.isCafeBookmarked(cafeId, email)
			.then((result) => {
				if (!result) return res.sendStatus(404);
				res.sendStatus(200);
			})
			.catch((error) => {
				console.error(error);
				res.status(400).json({
					message: "INTERNAL SERVER ERROR",
				});
			});
	},

	toggleCafeBookmark: (req, res) => {
		const cafeId = req.params.cafe_id;
		const email = req.session?.login.email;
		const isBookmarked = req.body.isBookmarked;

		userService
			.toggleCafeBookmark(cafeId, email, isBookmarked)
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).json({
					message: "INTERNAL SERVER ERROR",
				});
			});
	},

	getMyCafeBookmarks: async (req, res) => {
		const email = req.session.login.email;
		const bookmarks = await cafeService.findCustomerBookmarks(email);

		if (!bookmarks) res.sendStatus(404);
		else
			res.status(200).json({
				message: "good",
				data: { bookmarks: bookmarks },
			});
	},

	getMyCafeReviews: async (req, res) => {
		const email = req.session.login.email;
		const reviews = await cafeReviewService.findCustomerMyReviews(email);

		if (!reviews) res.sendStatus(404);
		else
			res.status(200).json({
				message: "good",
				data: { reviews: reviews },
			});
	},

	getMyLikedReviews: async (req, res) => {
		const email = req.session.login.email;
		const pageNum = req.query.page_num;
		const reviews = await cafeReviewService.findCustomerMyLikedReviews(
			email,
			Number(pageNum)
		);

		if (!reviews) res.sendStatus(404);
		else
			res.status(200).json({
				message: "good",
				data: { reviews: reviews },
			});
	},
};

module.exports = userController;
