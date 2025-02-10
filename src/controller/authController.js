const authService = require("../service/authService");
const randomTokenService = require("../service/randomTokenService");

const authController = {
	getLogin: (req, res) => {
		res.render("login", { errorMessage: null });
	},

	postLogin: async (req, res, next) => {
		const { user_type, email, password } = req.body;

		try {
			const user = await authService.authenticate(user_type, email, password);

			if (!user)
				return res.render("login", {
					errorMessage: "이메일 또는 비밀번호가 잘못되었습니다.",
				});
			req.session.regenerate((err) => {
				if (err) throw err;

				delete user.password;
				delete user.user_id;
				req.session.login = user;
				req.session.login.user_type = user_type; // user table not in user type
				req.session.save((err) => {
					if (err) throw err;
					res.redirect("/cafes");
				});
			});
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	},

	postLogout: (req, res, next) => {
		req.session.destroy((err) => {
			if (err) return next(err);

			res.redirect("/");
		});
	},

	getSignup: (req, res) => {
		res.render("signup/sign-up", { errorMessage: null });
	},

	postSignup: async (req, res) => {
		const isEmailVerified = req.session.isEmailVerified;
		const user_type = req.body.user_type;

		if (!isEmailVerified)
			return res.render("signup/sign-up", {
				errorMessage: "인증되지 않은 이메일입니다.",
			});

		try {
			await authService.signup(user_type, req.body);
			res.redirect("/cafes");
		} catch (err) {
			console.error(err);
			res.render("signup/sign-up", {
				errorMessage: "중복된 이메일입니다.",
			});
		}
	},

	postSendSignupVerificationEmail: (req, res) => {
		const email = req.body.email;

		if (!email) return res.sendStatus(400);
		authService
			.sendVerificationCodeByEmail(email)
			.then(() => res.sendStatus(200))
			.catch((err) => {
				console.error(err);
				return res.sendStatus(500);
			});
	},

	postVerifySignupVerificationCode: async (req, res) => {
		const { email, user_code } = req.body;

		if (!email || !user_code)
			try {
				const result = await authService.verifyUserCode(email, user_code);

				if (result) {
					req.session.isEmailVerified = true;
					res.sendStatus(200);
				} else res.sendStatus(401);
			} catch (err) {
				console.error(err);
				res.sendStatus(500);
			}
	},

	getResetPassword: async (req, res) => {
		const email = req.query.email;
		const user_token = req.query.token;

		if (!user_token) return res.render("reset-password", { isReset: false });
		if (!randomTokenService.verifyUserToken(email, user_token))
			return res.render("error", {
				error: { message: "잘 못 된 접근입니다." },
			});
		res.render("reset-password", { isReset: true, email: email });
	},

	postResetPassword: async (req, res) => {
		const email = req.body.email;

		if (randomTokenService.sendRandomTokenByEmail(email)) {
			req.session.isEmailVerified = email; // email로 session 값을 저장하면 토큰이 달라져도 상관 X ?
			res.sendStatus(200);
		} else res.sendStatus(500);
	},

	patchResetPassword: async (req, res) => {
		const { email, password } = req.body;
		const isEmailVerified = req.session.isEmailVerified;

		if (isEmailVerified != email)
			return res.status(401).json({ message: "SESSION EXPIRED" });

		try {
			await authService.changePassword("customer", email, password);
			res.sendStatus(200);
		} catch (err) {
			console.err(err);
			res.status(500).json({ message: "INTERNAL SERVER ERROR" });
		}
	},
};

module.exports = authController;
