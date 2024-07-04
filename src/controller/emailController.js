const VerificationCodeService = require("../service/verificationCodeService");

const emailController = {
	postEmailSignupRequest: (req, res) => {
		const email = req.body.email;

		if (VerificationCodeService.sendVerificationCodeByEmail(email))
			res.sendStatus(200);
		else res.sendStatus(500);
	},

	postEmailSignupVerification: async (req, res) => {
		const { email, user_code } = req.body;

		try {
			const result = await VerificationCodeService.verifyUserCode(
				email,
				user_code
			);

			if (result) {
				req.session.isEmailVerified = true;
				res.sendStatus(200);
			} else res.sendStatus(401);
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	},
};

module.exports = emailController;
