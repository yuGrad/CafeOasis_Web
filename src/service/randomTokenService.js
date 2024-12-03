const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const HOST_ADDR = process.env.HOST_ADDR;

const emailService = require("./emailService");
const RandomToken = require("../repository/RandomToken");

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
		const subject = "Welcome to Oasis! - Password Rest Url";
		const html = `<h2>Hello ${to}</h2>
                Password Reset Url
                </br>
                link: 
                http://${HOST_ADDR}/users/reset-password?token=${passwordToken}&email=${to}`;

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

	async verifyUserToken(email, userToken) {
		try {
			const row = await RandomToken.getRandomToken(email);
			const now = new Date();

			if (
				!row ||
				row.token != userToken ||
				new Date(row.expiration_time) <
					new Date(now.getTime() - now.getTimezoneOffset() * 60000)
			)
				return false;

			// VerificationCode.updateCodeAsVerified(row.id, (err) => {
			//   if (err) console.error(err);
			// });
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
};

module.exports = RandomTokenService;
