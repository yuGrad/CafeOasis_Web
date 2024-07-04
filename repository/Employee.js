const db = require("../db/mysql_db");

const Employee = {
	async getEmployeeByEmail(email) {
		const sql = "select * from Employee where email = ?";
		const params = [email];
		const [employee] = await db.query(sql, params);

		return employee;
	},

	async insertEmployee(email, password, name, phone_no) {
		const sql =
			"insert into Employee(email, password, name, phone_no, registration_date, is_active) \
                  values(?, ?, ?, ?, ?, ?);";
		const params = [email, password, name, phone_no, new Date(), 1];

		await db.query(sql, params);
	},
};

module.exports = Employee;
