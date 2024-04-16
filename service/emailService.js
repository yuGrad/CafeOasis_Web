const nodemailer = require("nodemailer");
const crypto = require("crypto");
const config = require("../config");
const VerificationCode = require("../repositorie/VerificationCode");

function sendEmail(to, subject, text, html) {
  const transporter = nodemailer.createTransport(config.smtp_config);
  const mailOptions = {
    from: config.smtp_config.from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error(err);
  });
}

function generateVerificationCode() {
  const codeSize = 8;
  const bytes = crypto.randomBytes(codeSize);
  const verificationCode = bytes.toString("base64").slice(0, codeSize); // 숫자로 변환 후 문자열 슬라이싱

  return verificationCode;
}

async function verifyUserCode(email, userCode) {
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
}

function storeVerificationCode(email, verification_code, expiration) {
  VerificationCode.insertVerificationCode(
    email,
    verification_code,
    expiration,
    (err) => {
      if (err) console.error(err);
    }
  );
}

module.exports = {
  sendEmail,
  generateVerificationCode,
  verifyUserCode,
  storeVerificationCode,
};
