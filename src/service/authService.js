const bcrypt = require("bcrypt");
const { DynamicPool } = require("node-worker-threads-pool");

const dotenv = require("dotenv");
dotenv.config();
const HOST_ADDR = process.env.HOST_ADDR;

const Customer = require("../repository/Customer");
const Employee = require("../repository/Employee");
const VerificationCode = require("../repository/VerificationCode");
const RandomToken = require("../repository/RandomToken");

const { sendEmail } = require("../utils/emailUtil");
const { generateRandomToken } = require("../utils/tokenUtil");

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

	async signup(userType, userData) {
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
		} = userData;
		const phone_no = phone_no_1 + phone_no_2 + phone_no_3;
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
		const verificationCode = generateRandomToken(8);
		const to = email;
		const subject = "Welcome to Oasis! - Email Code";
		const html = `<h2>Hello ${to}</h2>
                    welcome to our service!
                    </br>
                    email code: ${verificationCode}`;

		return sendEmail(to, subject, "test", html).then((res) => {
			VerificationCode.insertVerificationCode(
				to,
				verificationCode,
				"00:30:00",
				(err) => {
					if (err) console.error(err);
				}
			);
			return res;
		});
	},

	async verifyUserCode(email, userCode) {
		if (userCode.length != 8) return false;
		try {
			const row = await VerificationCode.getLatestByEmail(email);
			const now = new Date();

			if (
				!row ||
				row.verification_code != userCode ||
				new Date(row.expiration_time) <
					new Date(now.getTime() - now.getTimezoneOffset() * 60000) // 현재 시간보다 인증 만료시간이 더 커야함, UTC -> Asia/Seoul 시간대로 변경
			)
				return false;

			VerificationCode.updateAsVerified(row.id, (err) => {
				if (err) console.error(err);
			});
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},

	sendPasswordResetLinkByEmail(email, name) {
		return Customer.getCustomerByEmail(email).then((user) => {
			if (user.name === name) {
				const randomToken = generateRandomToken(20);
				const to = email;
				const subject = "Welcome to Oasis! - Password Rest Url";
				const html = `<h2>Hello ${to}</h2>
                Password Reset Url
                </br>
                link: 
                http://${HOST_ADDR}/auth/password?token=${randomToken}&email=${to}`;

				return sendEmail(to, subject, "test", html).then((res) => {
					RandomToken.insertRandomToken(
						to,
						"password",
						randomToken,
						"03:00:00",
						(err) => {
							if (err) console.error(err);
						}
					);
					return res;
				});
			}
			throw new Error("The names don't match");
		});
	},

	async verifyPasswordResetToken(email, passwordToken) {
		if (passwordToken.length != 20) return false;
		try {
			const row = await RandomToken.getLatestByEmail(email);
			const now = new Date();

			if (
				!row ||
				row.token != passwordToken ||
				new Date(row.expiration_time) <
					new Date(now.getTime() - now.getTimezoneOffset() * 60000)
			)
				return false;
			RandomToken.updateAsVerified(row.id, (err) => {
				if (err) console.error(err);
			});
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},

	async changePassword(userType, email, password) {
		const hashed_password = await hashPasswordInWorker(password, this.salt);

		// Todo: password 정책 설정
		// if (userType == "employee")	// employee 비밀번호 변경 로직 필요
		// 	await Employee.updatePassword(email, hashed_password);
		await Customer.updatePassword(email, hashed_password);
	},
};

module.exports = authService;
