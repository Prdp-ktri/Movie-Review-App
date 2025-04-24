const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://pradeepseeks:pradeepseeks0808@cluster0.bgpv7ce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Review model
const reviewSchema = new mongoose.Schema({
  title: String,
  review: String,
  rating: String,
  reviewer: String,
  coverImage: String,
});

const Review = mongoose.model("Review", reviewSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes

// Fetch all reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Add a new review
app.post("/api/reviews", upload.single("coverImage"), async (req, res) => {
  try {
    const newReview = new Review({
      ...req.body,
      coverImage: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newReview.save();
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Error saving review" });
  }
});

// Delete a review
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review" });
  }
});

// No major changes here apart from ensuring the PUT route accepts a file upload

app.put("/api/reviews/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const updatedReviewData = { ...req.body };
    if (req.file) {
      updatedReviewData.coverImage = `/uploads/${req.file.filename}`;
    }
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updatedReviewData,
      { new: true }
    );
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
