const Cafe = require("../repository/Cafe");
const CafeCache = require("../repository/CafeCache");

const cafeService = {
	async fineCafeById(cafeId) {
		let cafe = await CafeCache.getCafeById(cafeId);

		if (!cafe) {
			cafe = await Cafe.getCafeById(cafeId);
			CafeCache.setCafeById(cafeId, cafe);
		}
		return cafe;
	},

	toggleCafeBookmark(cafeId, email, isBookmarked) {
		if (!isBookmarked) {
			return Cafe.pushCafeBookmark(cafeId, email);
		}
		return Cafe.removeCafeBookmark(cafeId, email);
	},

	async findCustomerBookmarks(email) {
		return await Cafe.findBookmarksByEmail(email);
	},
};

module.exports = cafeService;
