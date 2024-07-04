const express = require("express");
const router = express.Router();
const emailController = require("../controller/emailController");

router.post("/signup/request", emailController.postEmailSignupRequest);

router.post(
	"/signup/verification",
	emailController.postEmailSignupVerification
);

module.exports = router;
