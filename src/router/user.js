const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/login", userController.getUserLogin);

router.post("/login", userController.postUserLogin);

router.post("/logout", userController.postUserLogout);

router.get("/signup", userController.getUserSignup);

router.post("/signup", userController.postUserSignup);

router.get("/mypage", userController.getUserMypage);

router.get("/reset-password", userController.getUserResetPassword);

router.post("/reset-password", userController.postUserResetPassword);

router.patch("/reset-password", userController.patchUserResetPassword);

module.exports = router;
