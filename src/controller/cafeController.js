const CafeService = require("../service/cafeService");

const cafeController = {
	getCafeMain: (req, res) => {
		res.render("cafe-main", { login: req.session.login, cafes: [] });
	},

	getCafeById: async (req, res) => {
		const cafe_id = req.params.cafe_id;
		const cafe = await CafeService.findCafeDetail(cafe_id);

		if (!cafe) return res.sendStatus(404);
		res.render("cafe-detail", { login: req.session.login, cafe: cafe });
	},

	getCafesBySearch: async (req, res) => {
		const { target, page_num } = req.query;

		if (!target) return res.sendStatus(400);

		try {
			const cafes = await CafeService.searchCafes(target, Number(page_num));
			res.status(200).json({ message: "", data: { cafes } });
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	},
};

module.exports = cafeController;
