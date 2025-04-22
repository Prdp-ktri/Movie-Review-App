const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    review: String,
    rating: Number,
    reviewer: String,
    image: String, // image path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
