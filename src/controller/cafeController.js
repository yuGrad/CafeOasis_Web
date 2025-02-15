const CafeService = require("../service/cafeService");

const cafeController = {
	getCafeById: async (req, res) => {
		const cafe_id = req.params.cafe_id;
		const cafe = await CafeService.findCafeDetail(cafe_id);
		res.render("cafe-detail", { login: req.session.login, cafe: cafe });
	},

	getCafesBySearch: async (req, res) => {
		const target = req.query.target;

		if (target == undefined || target == null || target == "") {
			res.render("cafe-main", { login: req.session.login, cafes: [] });
			return;
		}

		try {
			const cafes = await CafeService.searchCafes(target);
			res.render("cafe-main", { login: req.session.login, cafes: cafes });
		} catch (err) {
			res.render("error", { error: { message: "잘 못 된 접근입니다." } });
		}
	},
};

module.exports = cafeController;
