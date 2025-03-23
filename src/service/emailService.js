const { sendEmail } = require("../utils/emailUtil");

const emailService = {
	sendVerificationCode(email, verificationCode) {
		const subject = "Welcome to Oasis! - Email Code";
		const html = `<h2>Hello ${email}</h2>
				  Welcome to our service!<br/>
				  Email code: ${verificationCode}`;
		return sendEmail(email, subject, "text", html);
	},

	sendPasswordResetLink(email, resetLink) {
		const subject = "Welcome to Oasis! - Password Reset Link";
		const html = `<h2>Hello ${email}</h2>
				  Password Reset Link: <a href="${resetLink}">${resetLink}</a>`;
		return sendEmail(email, subject, "text", html);
	},
};

module.exports = emailService;
