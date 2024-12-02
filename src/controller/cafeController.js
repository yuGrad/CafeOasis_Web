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
		const cafeId = req.params.cafe_id;
		const email = req.session?.login?.email || null; // 안전하게 email 읽기, 없으면 null

		Cafe.getCafeBookmarkByEmail(cafeId, email)
			.then((result) => {
				if (!result) return res.sendStatus(404);
				res.sendStatus(200);
			})
			.catch((error) => {
				console.error(error);
				res.status(400).json({
					message: "Bookmark 조회에 실패했습니다.",
				});
			});
	},

	toggleCafeBookmark: (req, res) => {
		const cafeId = req.params.cafe_id;
		const email = req.session?.login?.email || null;
		const isBookmarked = req.body.isBookmarked;

		CafeService.toggleCafeBookmark(cafeId, email, isBookmarked)
			.then((result) => {
				// if (!result) return res.sendStatus(409);
				res.sendStatus(200);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).json({
					message: "Bookmark 상태 업데이트에 실패했습니다.",
				});
			});
	},
};

module.exports = cafeController;
