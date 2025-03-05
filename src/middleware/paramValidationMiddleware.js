const paramValidationMiddleware = {
	pageNum: (req, res, next) => {
		const pageNum = Number(req.query.page_num);
		if (!Number.isInteger(pageNum) || pageNum < 0) return res.sendStatus(400);
		next();
	},
};

module.exports = paramValidationMiddleware;
