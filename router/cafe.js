const express = require("express");
const router = express.Router();

router.use("", (req, res) => {
  res.render("cafe-main", { login: req.session.login, cafes: [] });
});

router.use("/search", (req, res) => {
  const target = req.query.target;

  res.redirect("/cafes");
});

module.exports = router;
