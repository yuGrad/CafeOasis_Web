const express = require("express");
const router = express.Router();
const Employee = require("../repositorie/Employee");
const Customer = require("../repositorie/Customer");
const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);

router.get("/login", (req, res) => {
  res.render("login", { errorMessage: null });
});

router.post("/login", async (req, res, next) => {
  const { user_type, email, password } = req.body;
  let user;

  try {
    if (user_type == "employee")
      user = await Employee.getCustomerByEmail(email);
    else user = await Customer.getCustomerByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.regenerate((err) => {
        if (err) next(err);

        req.session.login = user;
        req.session.login.user_type = user_type; // user table not in user type
        delete req.session.login.password;
        delete req.session.login.user_id;
        req.session.save((err) => {
          if (err) next(err);
          res.redirect("/cafes");
        });
      });
    } else
      res.render("login", {
        errorMessage: "이메일 또는 비밀번호가 잘못되었습니다.",
      });
  } catch (err) {
    console.log(err);
    res.render("error", { error: { message: "500 Error" } });
  }
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
  const isEmailVerified = req.session.isEmailVerified;
  const user_type = req.body.user_type;

  if (!isEmailVerified)
    return res.render("sign-up", {
      errorMessage: "인증되지 않은 이메일입니다.",
    });

  try {
    if (user_type == "employee") {
      const { email, password, name, phone_no } = req.body;
      const hashed_password = bcrypt.hashSync(password, salt);
      await Employee.insertEmployee(email, hashed_password, name, phone_no);
    } else {
      const {
        email,
        password,
        name,
        phone_no_1,
        phone_no_2,
        phone_no_3,
        nickname,
        age,
        sex,
      } = req.body;
      const phone_no = phone_no_1 + phone_no_2 + phone_no_3;
      const hashed_password = bcrypt.hashSync(password, salt);
      await Customer.insertCustomer(
        email,
        hashed_password,
        name,
        phone_no,
        nickname,
        age,
        sex
      );
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
