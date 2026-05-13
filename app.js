const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middelwares
app.use(express.urlencoded({ extended: true })); // to load form data by req

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({}); // find all camps in the db
  res.render("campgrounds/index", { campgrounds }); // render it to campground page
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds/new-camp", async (req, res) => {
  const newCamp = new Campground(req.body);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  // const { id } = req.params;
  // Used async await to get the data
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
  // You could use thennable method like below or callback method
  // Campground.findById(id).then((campground) => {
  //   res.render("campgrounds/show", { campground });
  // });
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
