const authService = require("../service/authService");

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
		const {
			email,
			password,
			name,
			phone_no_1,
			phone_no_2,
			phone_no_3,
			nickname,
			age,
			sex,
			userType,
		} = req.body;

		// TODO: 회원가입 요청 검증
		try {
			await authService.signup(
				email,
				password,
				name,
				phone_no_1 + phone_no_2 + phone_no_3,
				nickname,
				age,
				sex,
				userType
			);
			res.redirect("/cafes");
		} catch (err) {
			let errorMessage;
			if (err.message === "Email not verified")
				errorMessage = "이메일 인증이 완료되지 않았습니다.";
			else if (err.message === "Email already exists")
				errorMessage = "중복된 이메일입니다.";
			else {
				errorMessage = "회원가입 중 오류가 발생했습니다.";
				console.error(err);
			}
			res.render("signup/sign-up", {
				errorMessage: errorMessage,
			});
		}
	},

	postSendSignupVerificationEmail: (req, res) => {
		const email = req.body.email;

		try {
			if (!email) return res.sendStatus(400);
			authService.sendVerificationCodeByEmail(email);
			res.sendStatus(200);
		} catch (err) {
			console.error(err);
			return res.sendStatus(500);
		}
	},

	postVerifySignupVerificationCode: async (req, res) => {
		const { email, user_code } = req.body;

		if (!email || !user_code) res.sendStatus(400);
		try {
			const result = await authService.verifyUserCode(email, user_code);

			if (result) res.sendStatus(200);
			else res.sendStatus(401);
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	},

	getResetPassword: async (req, res) => {
		// TODO: 해당 컨트롤러가 패스워드 링크 검증하는 메소드로 변경
		const email = req.query.email;
		const token = req.query.token;

		if (!email || !token)
			return res.render("reset-password", { isReset: false });
		if (!(await authService.verifyPasswordResetToken(email, token)))
			return res.render("error", {
				error: { message: "잘 못 된 접근입니다." },
			});
		res.render("reset-password", { isReset: true, email: email });
	},

	postSendPasswordResetLink: (req, res) => {
		const { email, name } = req.body;

		try {
			authService.sendPasswordResetLinkByEmail(email, name);
			res.sendStatus(200);
		} catch (err) {
			console.error(err);
			return res.sendStatus(500);
		}
	},

	postResetNewPassowrd: async (req, res) => {
		const { email, password } = req.body;

		try {
			await authService.changePassword("customer", email, password);
			res.sendStatus(200);
		} catch (err) {
			if (err.message === "Email not verified")
				res.status(401).json({ message: "이메일 인증이 완료되지 않았습니다." });
			else {
				console.error(err);
				res.status(500).json({ message: "INTERNAL SERVER ERROR" });
			}
		}
	},
};

module.exports = authController;
