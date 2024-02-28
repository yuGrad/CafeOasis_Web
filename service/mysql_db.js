const mysql = require("mysql2/promise");

const pool = mysql.createPool(config.mysql_config);

async function query(sql, params) {
  const conn = await pool.getConnection();
  const [rows] = await conn.query(sql, params);
  return rows;
}

module.exports = { query };
