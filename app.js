/** Try to understand the full code at home when you pull */
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./helper/ExpressError");
const methodOverride = require("method-override");
const campgrundsRouter = require("./routes/campgrounds");
const reviewsRouter = require("./routes/reviews");

// Connecting to database
mongoose.connect("mongodb://localhost:27017/aluth-camp");

// Databse connection error checking
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("Mongoose connection error", err);
});
db.once("open", () => {
  console.log("Database connected");
});

// App settings
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middelwares
app.use(express.urlencoded({ extended: true })); // to load/parse form data by req
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // to serve the public folder directory

// Session
const sessionConfig = {
  secret: "findbettersecret",
  resave: false,
  saveUninitialized: true, // false: does not save empty session. Reccomended for modern apps (use: login, carts...), unless you wanna track every users visit the website (use: tracking user permission, server-sdie analytics...) make it true
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Create flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Router
app.use("/campgrounds", campgrundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("/{*path}", (req, res, next) => {
  // res.send("404!");
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  // res.send("Oh Boy We Got Hit By Something!!!");
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
