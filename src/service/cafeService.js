const Cafe = require("../repository/Cafe");

const cafeService = {
	toggleCafeBookmark(cafeId, email, isBookmarked) {
		if (!isBookmarked) {
			return Cafe.pushCafeBookmark(cafeId, email);
		}
		return Cafe.removeCafeBookmark(cafeId, email);
	},
};

module.exports = cafeService;
