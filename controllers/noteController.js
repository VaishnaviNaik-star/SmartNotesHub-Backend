const Note = require("../models/Note");

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("uploadedBy", "name role");
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add new note
const addNote = async (req, res) => {
  const { title, description, fileUrl } = req.body;
  try {
    const note = new Note({
      title,
      description,
      fileUrl,
      uploadedBy: req.user.id
    });
    await note.save();
    res.status(201).json({ message: "Note added successfully", note });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getNotes, addNote };
