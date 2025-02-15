const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/mypage", userController.getMyPage);

router.get("/me/cafe-bookmarks/:cafe_id", userController.getCafeBookmarked);

router.put("/me/cafe-bookmarks/:cafe_id", userController.toggleCafeBookmark);

router.get("/me/cafe-bookmarks", userController.getMyCafeBookmarks);

router.get("/me/cafe-reviews", userController.getMyCafeReviews);

router.get("/me/liked-reviews", userController.getMyLikedReviews);

module.exports = router;
