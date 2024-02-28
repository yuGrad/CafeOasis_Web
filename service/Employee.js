const db = require("./mysql_db");

const Employee = {
  async getEmployee(email, password) {
    const sql = "select * from Employee where email = ? and password = ?";
    const params = [email, password];

    const rows = await db.query(sql, params);
    return rows;
  },

  async insertEmployee(email, password, name, phone_no) {
    const sql =
      "insert into Employee(email, password, name, phone_no, registration_date, is_active) values(?, ?, ?, ?, ?, ?);";
    const params = [email, password, name, phone_no, new Date(), 1];

    await db.query(sql, params);
  },
};

module.exports = Employee;
