const express = require("express");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartNotesHub", // folder in Cloudinary
    resource_type: "auto",   // allows PDFs, docs, etc.
  },
});

const upload = multer({ storage });


// ✅ POST - Upload a note
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
    fileUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,

    
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


