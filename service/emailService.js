const nodemailer = require("nodemailer");
const config = require("../config");

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

module.exports = { sendEmail, generateVerificationCode };
