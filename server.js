const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const seedDemoNotes = require("./seedDemoNotes");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

dotenv.config();
const app = express();

// ✅ CORS Configuration for both local and Render frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      "https://smartnoteshub-frontend.onrender.com", // deployed frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Serve uploaded files
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Smart NotesHub Backend Running Successfully!");
});


// ✅ Connect MongoDB and seed demo notes
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully!");
    await seedDemoNotes(); // Auto-seed demo notes
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

