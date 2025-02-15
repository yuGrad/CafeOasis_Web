const Cafe = require("../repository/Cafe");

const userService = {
	isCafeBookmarked(cafeId, email) {
		return Cafe.findCafeBookmarkByCafeIdAndEmail(cafeId, email).then(
			(res) => res != null
		);
	},

	toggleCafeBookmark(cafeId, email, isBookmarked) {
		if (!isBookmarked) {
			return Cafe.pushCafeBookmark(cafeId, email);
		}
		return Cafe.removeCafeBookmark(cafeId, email);
	},
};

module.exports = userService;
