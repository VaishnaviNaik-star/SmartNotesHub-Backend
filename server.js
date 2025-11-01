const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const seedDemoNotes = require("./seedDemoNotes");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const uploadcareRoutes = require("./routes/uploadcare"); // ✅ FIXED: use require instead of import

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://smartnoteshub-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Static uploads (for demo files)
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/uploadcare", uploadcareRoutes); // ✅ Keep this below notes

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Smart NotesHub Backend Running Successfully!");
});

// ✅ MongoDB + Seed
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully!");
    await seedDemoNotes();
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
