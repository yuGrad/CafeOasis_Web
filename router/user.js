const express = require("express");
const router = express.Router();
const Employee = require("../service/Employee");
const e = require("express");

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
        req.session.login = employee;
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

router.get("/signup", (req, res) => {
  res.render("sign-up", { errorMessage: null });
});

router.post("/signup", async (req, res) => {
  const { email, password, name, phone_no } = req.body;
  try {
    await Employee.insertEmployee(email, password, name, phone_no);
    res.redirect("/");
  } catch (err) {
    res.render("sign-up", {
      errorMessage: "중복된 이메일입니다.",
    });
  }
});

module.exports = router;
