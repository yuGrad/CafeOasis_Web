const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/login", userController.getUserLogin);

router.post("/login", userController.postUserLogin);

router.post("/logout", userController.postUserLogout);

router.get("/signup", userController.getUserSignup);

router.post("/signup", userController.postUserSignup);

router.get("/reset-password", userController.getUserResetPassword);

router.post("/reset-password", userController.postUserResetPassword);

router.patch("/reset-password", userController.patchUserResetPassword);

router.get("/mypage", userController.getMyPage);

router.get("/me/cafe-bookmarks", userController.getMyCafeBookmarks);

router.get("/me/cafe-reviews", userController.getMyCafeReviews);

router.get("/me/liked-reviews", userController.getMyLikedReviews);

module.exports = router;
