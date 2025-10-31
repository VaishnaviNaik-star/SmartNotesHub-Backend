const express = require("express");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// ✅ Multer file storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ POST - Upload a note
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
      fileUrl: `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/${req.file.filename}`,
      uploadedBy: req.user.id, // user ID from token
      role: req.user.role,
    });
    await note.save();
    res.status(201).json({ message: "Note uploaded successfully", note });
  } catch (err) {
    console.error("Error uploading note:", err);
    res.status(500).json({ message: "Failed to upload note" });
  }
});

// ✅ GET - Fetch all notes (public)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ✅ GET - Fetch only logged-in user's notes (Dashboard)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching user notes:", err);
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
});

module.exports = router;
