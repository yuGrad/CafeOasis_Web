const crypto = require("crypto");
const emailService = require("./emailService");
const RandomToken = require("../repositorie/RandomToken");

const RandomTokenService = {
  generateRandomToken() {
    const codeSize = 20;
    const bytes = crypto.randomBytes(codeSize);
    const randomToken = bytes.toString("base64").slice(0, codeSize); // 숫자로 변환 후 문자열 슬라이싱

    return randomToken;
  },

  sendRandomTokenByEmail(email) {
    const passwordToken = this.generateRandomToken();
    const to = email;
    const subject = "Welcome to Oasis! - Email Code";
    const html = `<h2>Hello ${to}</h2>
                Password Reset Url
                </br>
                link: http://localhost:3000/reset_password?token=${passwordToken}`;

    try {
      emailService.sendEmail(to, subject, "test", html);
      RandomToken.insertRandomToken(
        to,
        "password",
        passwordToken,
        "03:00:00",
        (err) => {
          if (err) console.error(err);
        }
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

module.exports = RandomTokenService;
