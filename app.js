const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = process.env.PORT | 3000;

const { RedisClient, RedisStore } = require("./src/db/redis_db");
const { swaggerUi, specs } = require("./swagger/swagger");

const userRouter = require("./src/router/user");
const cafeRouter = require("./src/router/cafe");
const emailRouter = require("./src/router/email");

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		store: RedisStore,
		resave: false,
		saveUninitialized: false,
		rolling: false,
	})
);

app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/users", userRouter);
app.use("/cafes", cafeRouter);
app.use("/email", emailRouter);
app.use("/", (req, res) => {
	res.render("main");
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
