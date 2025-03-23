const crypto = require("crypto");

function generateRandomToken(tokenSize) {
	const bytes = crypto.randomBytes(tokenSize);
	const randomToken = bytes.toString("base64").slice(0, tokenSize); // 숫자로 변환 후 문자열 슬라이싱

	return randomToken;
}

module.exports = { generateRandomToken };
