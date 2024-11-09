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
		// type: "OAuth2",
		// user: process.env.GMAIL_OAUTH_USER,
		// clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
		// clientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
		// accessToken: process.env.GAMIL_OAUTH_ACCESS_TOKEN,
		// refreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
		user: process.env.GMAIL_EMAIL,
		pass: process.env.GAMIL_APP_PASSWORD,
	},
	from: "tgu06167@gmial.com",
};

const redis_config = {
	url: process.env.REDIS_URL,
};

module.exports = { mysql_config, mongo_config, smtp_config, redis_config };
