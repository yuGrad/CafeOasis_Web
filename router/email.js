const express = require("express");
const router = express.Router();
const VerificationCodeService = require("../service/verificationCodeService");

router.post("/signup/request", (req, res) => {
  const email = req.body.email;

  if (VerificationCodeService.sendVerificationCodeByEmail(email))
    res.sendStatus(200);
  else res.sendStatus(500);
});

router.post("/signup/verification", async (req, res) => {
  const { email, user_code } = req.body;

  try {
    const result = await VerificationCodeService.verifyUserCode(
      email,
      user_code
    );

    if (result) {
      req.session.isEmailVerified = true;
      res.sendStatus(200);
    } else res.sendStatus(401);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
