const express = require("express");
const router = express.Router();
const emailService = require("../service/emailService");

router.post("/signup/request", (req, res) => {
  const verificationCode = emailService.generateVerificationCode();
  const to = req.body.email;
  const subject = "Welcome to Oasis! - Email Code";
  const html = `<h2>Hello ${req.body.email}</h2>
                welcome to our service!
                </br>
                email code: ${verificationCode}`;

  try {
    emailService.sendEmail(to, subject, "test", html);
    emailService.storeVerificationCode(to, verificationCode, "00:30:00");
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post("/signup/verification", async (req, res) => {
  const { email, user_code } = req.body;

  try {
    const result = await emailService.verifyUserCode(email, user_code);

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
