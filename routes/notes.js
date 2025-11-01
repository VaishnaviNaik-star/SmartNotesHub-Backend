const express = require("express");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// ✅ POST - Upload a note
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,const express = require("express");
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// ✅ Local storage setup using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ POST - Upload a note
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
      fileUrl: req.file.path, // Local path instead of Cloudinary URL
      uploadedBy: req.user.id,
      role: req.user.role,
    });

    await note.save();
    res.status(201).json({ message: "Note uploaded successfully", note });
  } catch (err) {
    console.error("❌ Error uploading note:", err);
    res.status(500).json({ message: "Failed to upload note" });
  }
});

// ✅ GET - Fetch all notes
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

module.exports = router;

      subject: req.body.subject,
      fileUrl: req.file.path, // ✅ Cloudinary gives public URL automatically
      uploadedBy: req.user.id, // from JWT token
      role: req.user.role,
    });

    await note.save();
    res.status(201).json({ message: "Note uploaded successfully", note });
  } catch (err) {
    console.error("❌ Error uploading note:", err);
    res.status(500).json({ message: "Failed to upload note" });
  }
});

// ✅ GET - Fetch all notes (public)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ✅ GET - Fetch only logged-in user's notes (Dashboard)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching user notes:", err);
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
});

module.exports = router;


