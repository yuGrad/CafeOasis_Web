const nodemailer = require("nodemailer");
const config = require("../../config");

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

module.exports = {
	sendEmail,
};
