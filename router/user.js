const express = require("express");
const router = express.Router();
const Employee = require("../repositorie/Employee");
const Customer = require("../repositorie/Customer");

router.get("/login", (req, res) => {
  res.render("login", { errorMessage: null });
});

router.post("/login", (req, res, next) => {
  req.session.regenerate(async (err) => {
    if (err) next(err);
    else {
      const email = req.body.email;
      const password = req.body.password;
      const employee = await Employee.getEmployee(email, password);
      if (employee.length > 0) {
        req.session.login = employee[0];
        req.session.save((err) => {
          if (err) next(err);
          res.redirect("/cafes");
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

router.get("/signup", (req, res) => {
  res.render("sign-up", { errorMessage: null });
});

router.post("/signup", async (req, res) => {
  const user_type = req.body.user_type;

  try {
    if (user_type == "employee"){
      const { email, password, name, phone_no } = req.body;
      await Employee.insertEmployee(email, password, name, phone_no);
    }
    else{
      const { email, password, name, phone_no_1, phone_no_2, phone_no_3, nickname, age, sex} = req.body;
      const phone_no = phone_no_1 + phone_no_2 + phone_no_3;
      await Customer.insertCustomer(email, password, name, phone_no, nickname, age, sex);
    }
    res.redirect("/cafes");
  } catch (err) {
    console.log(err);
    res.render("sign-up", {
      errorMessage: "중복된 이메일입니다.",
    });
  }
});

router.get("/mypage", (req, res) => {
  res.render("mypage", { login: req.session.login });
});

module.exports = router;
