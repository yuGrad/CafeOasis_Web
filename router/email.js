const express = require("express");
const router = express.Router();
const emailService = require("../service/emailService");

router.post("/signup", async (req, res) => {
    const verificationCode = emailService.generateVerificationCode();
    const to = req.body.email;
    const subject = "Welcome to Oasis! - Email Code";
    const html = 
                `<h2>Hello ${req.body.email}</h2>
                welcome to our service!
                </br>
                email code: ${verificationCode}`;

    try{
        await emailService.sendEmail(to, subject, "test", html);
    }catch(err){
        console.error(err);
        res.render("sign-up", {
            errorMessage: "이메일 인증 실패",
        });
    }
});

module.exports = router;