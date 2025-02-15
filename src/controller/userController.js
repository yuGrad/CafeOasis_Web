const cafeService = require("../service/cafeService");
const cafeReviewService = require("../service/cafeReviewService");

const userController = {
	getMyPage: (req, res) => {
		if (!req.session.login)
			return res.render("error", {
				error: { message: "잘 못 된 접근입니다." },
			});
		res.render("mypage", { login: req.session.login });
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
