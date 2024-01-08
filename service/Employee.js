const db = require("./db");

const Employee = {
  async getEmployee(email, password) {
    const sql = "select * from Employee where email = ? and password = ?";
    const params = [email, password];

    const rows = await db.query(sql, params);
    return rows;
  },
};

module.exports = Employee;
