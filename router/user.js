const express = require("express");
const router = express.Router();
const dao = require("../service/dao");

router.get("/login", (req, res) => {
  res.render("login", { errorMessage: null });
});

router.post("/login", (req, res, next) => {
  req.session.regenerate(async (err) => {
    if (err) next(err);
    else {
      const email = req.body.email;
      const password = req.body.password;
      const customer = await dao.getCustomer(email, password);
      if (customer) {
        req.session.login = customer;
        req.session.save((err) => {
          if (err) next(err);
          res.redirect("/");
        });
      } else {
        res.render("login", {
          errorMessage: "이메일 또는 비밀번호가 잘못되었습니다.",
        });
      }
    }
  });
});

router.post("/logout", (req, res, next) => {
  req.session.regenerate((err) => {
    if (err) next(err);
    else {
      delete req.session.login;
      req.session.save((err) => {
        if (err) next(err);
        res.redirect("/");
      });
    }
  });
});

router.get("/books", async (req, res) => {
  const cid = req.session.login.cid;
  const books = await dao.getAllRentalBook(cid);
  obj = {
    login: req.session.login,
    books: books,
  };
  res.render("rental_list", obj);
});

module.exports = router;
