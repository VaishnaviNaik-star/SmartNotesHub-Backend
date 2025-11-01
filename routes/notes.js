// routes/notes.js
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// Temporary storage for incoming uploads
const upload = multer({ dest: "temp/" });

// Your Uploadcare Public Key
const UPLOADCARE_PUBLIC_KEY = "053b6a5e176a5da0e6ea";

/**
 * ✅ POST - Upload new note (saves on Uploadcare + MongoDB)
 */
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Prepare file for Uploadcare
    const fileStream = fs.createReadStream(req.file.path);
    const formData = new FormData();
    formData.append("UPLOADCARE_STORE", "1");
    formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
    formData.append("file", fileStream);

    // Upload to Uploadcare CDN
    const response = await axios.post("https://upload.uploadcare.com/base/", formData, {
      headers: formData.getHeaders(),
    });

    // Delete temp file after upload
    fs.unlinkSync(req.file.path);

    // Create public CDN link
    const fileUrl = `https://ucarecdn.com/${response.data.file}/`;

    // Save note in MongoDB
    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
      fileUrl,
      uploadedBy: req.user.id,
      role: req.user.role,
      uploadDate: new Date(),
    });

    await note.save();
    res.status(201).json({ message: "✅ Note uploaded successfully!", note });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Upload failed." });
  }
});

/**
 * ✅ GET - All notes (for Notes page)
 * Includes demo + user-uploaded notes
 */
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ uploadDate: -1 });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

/**
 * ✅ GET - Logged-in user's uploaded notes (for Dashboard)
 */
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id }).sort({ uploadDate: -1 });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching user notes:", err);
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
});

/**
 * ✅ DELETE - Only uploader can delete their notes
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Only uploader can delete
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can delete only your uploaded notes" });
    }

    await note.deleteOne();
    res.json({ message: "🗑️ Note deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
