const mysql = require("mysql2/promise");
const { MongoClient } = require("mongodb");
const config = require("../config");

const pool = mysql.createPool(config.mysql_config);

const mongoClient = new MongoClient(config.mongo_uri);

async function query(sql, params) {
  const conn = await pool.getConnection();
  const [rows] = await conn.query(sql, params);
  return rows;
}

module.exports = { query };
