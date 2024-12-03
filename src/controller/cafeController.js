const CafeService = require("../service/cafeService");
const Cafe = require("../repository/Cafe");

const cafeController = {
	getCafeById: async (req, res) => {
		const cafe_id = req.params.cafe_id;
		const cafe = await Cafe.getCafeById(cafe_id);
		res.render("cafe-detail", { login: req.session.login, cafe: cafe });
	},

	getCafesBySearch: async (req, res) => {
		const target = req.query.target;
		let cafes = [];

		if (target != undefined && target != null && target != "") {
			try {
				cafes = await Cafe.getCafesByNameOrAddr(target);
			} catch (err) {
				res.render("error", { error: { message: "잘 못 된 접근입니다." } });
			}
		}
		res.render("cafe-main", { login: req.session.login, cafes: cafes });
	},

	getCafeBookmarkStatus: (req, res) => {
		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });

		const cafeId = req.params.cafe_id;
		const email = req.session?.login.email;

		Cafe.getCafeBookmarkByEmail(cafeId, email)
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
		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });

		const cafeId = req.params.cafe_id;
		const email = req.session?.login.email;
		const isBookmarked = req.body.isBookmarked;

		CafeService.toggleCafeBookmark(cafeId, email, isBookmarked)
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
};

module.exports = cafeController;
