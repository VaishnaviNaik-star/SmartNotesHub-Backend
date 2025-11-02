const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ POST - Upload new note
router.post("/", verifyToken, async (req, res) => {
  console.log("Received body:", req.body); // ✅ safe place to log request body

  try {
    const { title, subject, fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL missing!" });
    }

    const newNote = new Note({
      title,
      subject,
      fileUrl,
      uploadedBy: req.user._id,
      uploadedByName: req.user.name,
      role: req.user.role,
    });

    await newNote.save();
    res
      .status(201)
      .json({ message: "✅ Note uploaded successfully!", note: newNote });
  } catch (err) {
    console.error("❌ Error uploading note:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ GET - All notes (for public view)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().populate("uploadedBy", "name");
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ✅ GET - Notes uploaded by the logged-in user
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching user notes:", err);
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
});

// ✅ DELETE - Only uploader can delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this note" });
    }

    await note.deleteOne();
    res.json({ message: "✅ Note deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
