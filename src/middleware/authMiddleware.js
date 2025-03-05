const authMiddleware = {
	authSession: (req, res, next) => {
		if (!req.session.login)
			return res.status(403).json({ message: "NOT LOGIN" });
		next();
	},
};

module.exports = authMiddleware;
