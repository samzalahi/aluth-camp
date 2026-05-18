const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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
app.use(express.urlencoded({ extended: true })); // to load/parse form data by req
app.use(methodOverride("_method"));

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

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
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

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  // res.send("It worked!!");
  // const { id } = req.params;
  // await Campground.updateOne({ _id: id }, { $set: req.body.campground });
  // Instead above method, there is better way findByIDAndUpdate()
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
  // Colt spread the data and send a copy of the object like below instead of send the whole object like i did above, both are valid way
  // const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
