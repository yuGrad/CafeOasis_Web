const express = require("express");
const router = express.Router();
const Cafe = require("../repository/Cafe");
const CafeReview = require("../repository/CafeReview");

router.get("/:cafe_id", async (req, res) => {
  const cafe_id = req.params.cafe_id;
  const cafe = await Cafe.getCafeById(cafe_id);
  res.render("cafe-detail", { login: req.session.login, cafe: cafe });
});

router.get("", async (req, res) => {
  const target = req.query.target;
  let cafes = [];

  if (target != undefined && target != null && target != "") {
    try {
      cafes = await Cafe.getCafesByNameOrAddr(target);
    } catch (err) {
      res.render("error", { error: { message: "잘 못 된 접근입니다." } });
    }
  }
  res.render("cafe-main", { login: req.session.login, cafes: cafes });
});

router.get("/reviews/:cafe_id", async (req, res) => {
  const cafe_id = req.params.cafe_id;
  const reviews = await CafeReview.getCafeReviewsById(cafe_id);

  res.status(200).json(reviews);
});

router.post("/reviews/:cafe_id", async (req, res) => {
  const cafe_id = req.params.cafe_id;
});

module.exports = router;
