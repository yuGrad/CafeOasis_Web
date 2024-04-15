const db = require("../db/mysql_db");

const Customer = {
  async getCustomerByEmail(email) {
    const sql = "select * from Customer where email = ?";
    const params = [email];
    const [customer] = await db.query(sql, params);

    return customer;
  },

  async insertCustomer(email, password, name, phone_no, nickname, age, sex) {
    const sql =
      "insert into Customer(email, password, name, phone_no, nickname, age, sex) \
                  values(?, ?, ?, ?, ?, ?, ?);";
    const params = [
      email,
      password,
      name,
      phone_no,
      nickname,
      age,
      sex,
      new Date(),
      1,
    ];

    await db.query(sql, params);
  },
};

module.exports = Customer;
