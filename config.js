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
  database: "oasis",
  // options: {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   poolSize: 10, // 커넥션 풀 사이즈 설정
  // },
};

const smtp_config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "tgu06167@gmail.com", // Gmail username
    pass: "yourpassword", // Gmail password or App password
  },
  from: "tgu06167@gmial.com",
};

module.exports = { mysql_config, mongo_config, smtp_config };
