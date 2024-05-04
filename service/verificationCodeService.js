const crypto = require("crypto");
const emailService = require("./emailService");
const VerificationCode = require("../repository/VerificationCode");

const VerificationCodeService = {
  generateVerificationCode() {
    const codeSize = 8;
    const bytes = crypto.randomBytes(codeSize);
    const verificationCode = bytes.toString("base64").slice(0, codeSize); // 숫자로 변환 후 문자열 슬라이싱

    return verificationCode;
  },

  sendVerificationCodeByEmail(email) {
    // Todo: email 보내는 메소드 비동기 처리
    const verificationCode = this.generateVerificationCode();
    const to = email;
    const subject = "Welcome to Oasis! - Email Code";
    const html = `<h2>Hello ${to}</h2>
                    welcome to our service!
                    </br>
                    email code: ${verificationCode}`;

    try {
      emailService.sendEmail(to, subject, "test", html);
      VerificationCode.insertVerificationCode(
        to,
        verificationCode,
        "00:30:00",
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

  async verifyUserCode(email, userCode) {
    try {
      const row = await VerificationCode.getVerificationCode(email);
      const now = new Date();

      if (
        !row ||
        row.verification_code != userCode ||
        new Date(row.expiration_time) <
          new Date(now.getTime() - now.getTimezoneOffset() * 60000) // 현재 시간보다 인증 만료시간이 더 커야함, UTC -> Asia/Seoul 시간대로 변경
      )
        return false;

      VerificationCode.updateCodeAsVerified(row.id, (err) => {
        if (err) console.error(err);
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

module.exports = VerificationCodeService;
