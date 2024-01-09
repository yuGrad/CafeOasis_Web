const express = require("express");
const router = express.Router();

router.use("", (req, res) => {
  res.render("cafe-main", { login: req.session.login, cafes: [] });
});

module.exports = router;
