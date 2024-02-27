const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  res.render("cafe-main", { login: req.session.login, cafes: [] });
});

router.get("/search", (req, res) => {
  const target = req.query.target;
  
  res.redirect("/cafes");
});

module.exports = router;
