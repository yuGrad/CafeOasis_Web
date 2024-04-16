const dotenv = require("dotenv");
dotenv.config();

const mysql_config = {
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "oasis",
  connectionLimit: 5,
  charset: "utf8mb4",
};

const mongo_config = {
  uri: process.env.MONGODB_URI,
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
    type: "OAuth2",
    user: process.env.GMAIL_OAUTH_USER,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
  },
  from: "tgu06167@gmial.com",
};

module.exports = { mysql_config, mongo_config, smtp_config };
