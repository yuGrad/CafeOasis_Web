const express = require("express");
const session = require("express-session");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.listen(3000, async () => {
  console.log("Server started on port 3000");
});
