const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Review = require("./models/Review");

const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB connection
mongoose.connect(
  "mongodb+srv://pradeepseeks:pradeepseeks0808@cluster0.bgpv7ce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
app.get("/api/reviews", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

app.post("/api/reviews", upload.single("image"), async (req, res) => {
  const { title, review, rating, reviewer } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const newReview = new Review({ title, review, rating, reviewer, image });
  await newReview.save();
  res.json(newReview);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
