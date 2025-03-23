const RandomToken = require("../repository/RandomToken");

const tokenService = {
	async isVerifiedEmail(email, type) {
		const token = await RandomToken.findByEmail(email);

		if (!token) return false; // 인증 요청이 없었거나 만료된 경우
		try {
			RandomToken.deleteByEmail(email);
			return token.verified === true && token.type === type;
		} catch (err) {
			console.error("토큰 파싱 에러:", err);
			return false;
		}
	},
};

module.exports = tokenService;
