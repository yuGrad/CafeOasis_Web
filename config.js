const mysql_config = {
  host: "localhost",
  user: "dudu",
  password: "aa1541",
  database: "oasis",
  connectionLimit: 5,
  charset: "utf8mb4",
};

const mongo_config = {
  uri: "mongodb://dudu:aa1541@0.0.0.0:27017",
  database: 'oasis',
  // options: {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   poolSize: 10, // 커넥션 풀 사이즈 설정
  // },
}

module.exports = { mysql_config, mongo_config };
