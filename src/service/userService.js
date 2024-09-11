const bcrypt = require("bcrypt");

const Customer = require("../repository/Customer");
const Employee = require("../repository/Employee");

const userService = {
	salt: bcrypt.genSaltSync(10),

	async authenticate(userType, email, password) {
		let user;

		if (userType === "employee") {
			user = await Employee.getEmployeeByEmail(email);
		} else {
			user = await Customer.getCustomerByEmail(email);
		}
		// user 존재 여부 && 비밀번호 체크 -> 인증
		if (user && bcrypt.compareSync(password, user.password)) return user;
		else return false;
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
		const hashed_password = bcrypt.hashSync(password, this.salt);

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

	async changePassword(userType, email, password) {
		const hashed_password = bcrypt.hashSync(password, this.salt);

		// Todo: password 정책 설정
		if (userType == "employee")
			// employee 비밀번호 변경 로직 필요
			await Customer.updatePassword(email, hashed_password);
		else await Customer.updatePassword(email, hashed_password);
	},
};

module.exports = userService;
