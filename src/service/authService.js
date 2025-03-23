const bcrypt = require("bcrypt");
const { DynamicPool } = require("node-worker-threads-pool");

const dotenv = require("dotenv");
dotenv.config();
const HOST_ADDR = process.env.HOST_ADDR;

const tokenService = require("../service/tokenService");

const Customer = require("../repository/Customer");
const Employee = require("../repository/Employee");
const RandomToken = require("../repository/RandomToken");

const { sendEmail } = require("../utils/emailUtil");

const dynamicPool = new DynamicPool(8);

async function hashPasswordInWorker(password, salt) {
	return dynamicPool.exec({
		task: (params) => {
			const bcrypt = require("bcrypt");
			const [password, salt] = params;
			return bcrypt.hashSync(password, salt);
		},
		param: [password, salt],
	});
}

async function comparePasswordInWorker(password, user_password) {
	return dynamicPool.exec({
		task: async (params) => {
			const bcrypt = require("bcrypt");
			const [password, user_password] = params;
			return bcrypt.compareSync(password, user_password);
		},
		param: [password, user_password],
	});
}

const authService = {
	salt: bcrypt.genSaltSync(10),

	async authenticate(userType, email, password) {
		let user;

		if (userType === "employee") {
			user = await Employee.getEmployeeByEmail(email);
		} else {
			user = await Customer.getCustomerByEmail(email);
		}

		// user 존재 여부 && 비밀번호 체크 -> 인증
		if (user) {
			// hash task -> worker thread로 실행
			const isMatch = await comparePasswordInWorker(password, user.password);
			return isMatch ? user : false;
		}
		return false;
	},

	async signup(email, password, name, phone_no, nickname, age, sex, userType) {
		if (!(await tokenService.isVerifiedEmail(email, "signup")))
			throw new Error("Email not verified");

		const hashed_password = await hashPasswordInWorker(password, this.salt);

		try {
			if (userType === "employee")
				await Employee.insertEmployee(email, hashed_password, name, phone_no);
			else
				await Customer.insertCustomer(
					email,
					hashed_password,
					name,
					phone_no,
					nickname,
					age,
					sex
				);
		} catch (err) {
			throw new Error("Email already exists");
		}
	},

	sendVerificationCodeByEmail(email) {
		const verificationCode = tokenService.generateRandomToken(8);
		const to = email;
		const subject = "Welcome to Oasis! - Email Code";
		const html = `<h2>Hello ${to}</h2>
					welcome to our service!
					</br>
					email code: ${verificationCode}`;

		sendEmail(to, subject, "test", html).then((res) => {
			if (!res) {
				// TODO: res에 따른 예외처리
			}
			RandomToken.create(to, "signup", verificationCode, false);
		});
	},

	async verifyUserCode(email, userCode) {
		if (userCode.length != 8) return false;

		try {
			const token = await RandomToken.findByEmail(email);
			if (!token || token.code != userCode) return false;

			RandomToken.create(email, "signup", token.code, true);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},

	sendPasswordResetLinkByEmail(email, name) {
		Customer.getCustomerByEmail(email).then((user) => {
			if (!user || user.name !== name) return;

			const randomToken = tokenService.generateRandomToken(20);
			const to = email;
			const subject = "Welcome to Oasis! - Password Rest Url";
			const html = `<h2>Hello ${to}</h2>
					Password Reset Url
					</br>
					link: 
					http://${HOST_ADDR}/auth/password?token=${randomToken}&email=${to}`;

			sendEmail(to, subject, "test", html).then((res) => {
				if (!res) {
					// TODO: res에 따른 예외처리
				}
				RandomToken.create(to, "passwd-reset", randomToken, false);
			});
		});
		// throw new Error("The names don't match");
	},

	async verifyPasswordResetToken(email, passwordToken) {
		if (passwordToken.length != 20) return false;
		try {
			const token = await RandomToken.findByEmail(email);
			if (!token || token.code != passwordToken) return false;

			RandomToken.create(email, "passwd-reset", token.code, true);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},

	async changePassword(userType, email, password) {
		if (!(await tokenService.isVerifiedEmail(email, "passwd-reset")))
			throw new Error("Email not verified");
		const hashed_password = await hashPasswordInWorker(password, this.salt);

		// Todo: password 정책 설정
		// if (userType == "employee")	// employee 비밀번호 변경 로직 필요
		// 	await Employee.updatePassword(email, hashed_password);
		await Customer.updatePassword(email, hashed_password);
	},
};

module.exports = authService;
