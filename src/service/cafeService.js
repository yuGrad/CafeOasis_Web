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

	async searchCafes(target, pageNum) {
		// TODO: Validate Target Argument
		const cafes = await Cafe.findCafesByNameOrAddr(target, pageNum, 10);
		return cafes;
	},

	async findCustomerBookmarks(email) {
		return await Cafe.findBookmarksByEmail(email);
	},

	async findNearbyCafes(lat, lng, radius) {
		return await Cafe.findNearbyByCoordinates(lat, lng, radius);
	},
};

module.exports = cafeService;
