const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

/**
 * ✅ POST - Upload new note (receives Uploadcare URL + metadata)
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, subject, fileUrl } = req.body;
    if (!title || !subject || !fileUrl) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const note = new Note({
      title,
      subject,
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
 * ✅ GET - All notes
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
 * ✅ GET - Logged-in user's notes
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
 * ✅ DELETE - Only uploader can delete
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

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
