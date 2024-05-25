const express = require("express");
const router = express.Router();
const cafeReviewService = require("../service/cafeReviewService");
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

router.patch("/reviews/:review_id/likes", async (req, res) => {
  const review_id = req.params.review_id;
  const email = req.session.login.email;

  if (!email) res.status(403).json({ message: "NOT LOGIN" });
  try {
    const result = await cafeReviewService.increaseLikeCnt(review_id, email);

    if (result) res.sendStatus(200);
    else res.status(409).json({ message: "EMAIL ALREADY INCLUDED" });
  } catch (err) {
    res.status(400).json({ message: "EMAIL OR REVIEW NOT EXISTS" });
  }
});

router.post("/reviews/:cafe_id", async (req, res) => {
  const { cafe_id, content, starring } = req.body;
  const email = req.session.login.email;

  if (!email) res.status(403).json({ message: "NOT LOGIN" });
  try {
    await cafeReviewService.registerCafeReview(
      cafe_id,
      email,
      content,
      starring
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
