const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

// Compile and export the model
module.exports = mongoose.model("Campground", CampgroundSchema);
