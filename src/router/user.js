const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controller/userController");

router.get("/mypage", authMiddleware.authSession, userController.getMyPage);

router.get(
	"/me/cafe-bookmarks/:cafe_id",
	authMiddleware.authSession,
	userController.getCafeBookmarked
);

router.put(
	"/me/cafe-bookmarks/:cafe_id",
	authMiddleware.authSession,
	userController.toggleCafeBookmark
);

router.get(
	"/me/cafe-bookmarks",
	authMiddleware.authSession,
	userController.getMyCafeBookmarks
);

router.get(
	"/me/cafe-reviews",
	authMiddleware.authSession,
	userController.getMyCafeReviews
);

router.get(
	"/me/liked-reviews",
	authMiddleware.authSession,
	userController.getMyLikedReviews
);

module.exports = router;
