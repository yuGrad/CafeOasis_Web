const Cafe = require("../repository/Cafe");
const CafeCache = require("../repository/CafeCache");

const cafeService = {
	async findCafeDetail(cafeId) {
		let cafe = await CafeCache.getCafeById(cafeId);

		if (!cafe) {
			cafe = await Cafe.findCafeById(cafeId);
			CafeCache.setCafeById(cafeId, cafe);
		}
		return cafe;
	},

	async searchCafes(target) {
		// TODO: Validate Target Argument
		const cafes = await Cafe.findCafesByNameOrAddr(target);
		return cafes;
	},

	async findCustomerBookmarks(email) {
		return await Cafe.findBookmarksByEmail(email);
	},
};

module.exports = cafeService;
