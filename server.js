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

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded PDFs statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Smart NotesHub Backend Running!");
});

// ✅ Connect MongoDB and seed demo notes
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedDemoNotes(); // 🔹 Auto-load demo notes
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
