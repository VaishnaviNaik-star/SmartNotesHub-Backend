const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ POST - Upload new note (from frontend)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, subject, fileUrl, uploadedBy, uploadedByName, role } = req.body;

    // Validate file
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL missing!" });
    }

    // ✅ Prepare safe data
    const noteData = {
      title,
      subject,
      fileUrl,
      uploadedByName,
      role,
    };

    // ✅ Only assign ObjectId if valid
    if (uploadedBy && mongoose.Types.ObjectId.isValid(uploadedBy)) {
      noteData.uploadedBy = uploadedBy;
    }

    const newNote = new Note(noteData);
    await newNote.save();

    res.status(201).json({ message: "✅ Note uploaded successfully!", note: newNote });
  } catch (err) {
    console.error("❌ Error uploading note:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ GET - Fetch all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ✅ GET - User’s own notes
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
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

    if (note.uploadedBy && note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can delete only your uploaded notes" });
    }

    await note.deleteOne();
    res.json({ message: "✅ Note deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
