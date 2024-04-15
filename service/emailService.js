const nodemailer = require("nodemailer");
const config = require("../config");
const VerificationCode = require("../repositorie/VerificationCode");

async function sendEmail(to, subject, text, html) {
  const transporter = nodemailer.createTransport(config.smtp_config);
  const mailOptions = {
    from: config.smtp_config.from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  await transporter.sendMail(mailOptions);
}

function generateVerificationCode() {
  const codeSize = 8;
  const verificationCode = crypto.randomBytes(codeSize);

  return verificationCode;
}

async function verifyUserCode(email, userCode) {
  try {
    const row = await VerificationCode.getVerificationCode(email);

    if (
      !row ||
      row.verification_code != userCode ||
      new Date(row.expiration_time) <
        new Date(new Date().getTime() - now.getTimezoneOffset() * 60000) // 현재 시간보다 인증 만료시간이 더 커야함, UTC -> Asia/Seoul 시간대로 변경
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
}

module.exports = { sendEmail, generateVerificationCode, verifyUserCode };
