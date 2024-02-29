const express = require("express");
const router = express.Router();
const Cafe = require("../repositorie/Cafe")

router.get("", async (req, res) => {
  const target = req.query.target;
  let cafes = [];

  if(target != undefined && target != null && target != ""){
    try{
      cafes = await Cafe.getCafesbyNameOrAddr(target);
    } catch(err){
      res.render("error", {error: {message: "잘 못 된 접근입니다."}});
    }
  }
  res.render("cafe-main", {login: req.session.login, cafes: cafes});
});

module.exports = router;