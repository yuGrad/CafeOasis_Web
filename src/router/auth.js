const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.post(
	"/signup/verification-email",
	authController.postSendSignupVerificationEmail
);

router.post(
	"/signup/verify-email",
	authController.postVerifySignupVerificationCode
);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.patch("/reset-password", authController.patchResetPassword);

module.exports = router;
