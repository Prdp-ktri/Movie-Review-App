const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path"); // Import the path module

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public"))); // Use path module here

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
  .catch((err) => console.error("MongoDB error:", err));

// Routes
const Review = require("./models/Review"); // assuming this file exists

app.get("/api/reviews", async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

app.post("/api/reviews", async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.json(review);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
