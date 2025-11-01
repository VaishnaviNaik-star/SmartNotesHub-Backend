const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const verifyToken = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// ✅ Local temporary storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // temporary folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ POST - Upload a note and store link from File.io
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload file to file.io
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post("https://file.io", formData, {
      headers: formData.getHeaders(),
    });

    // Remove local temp file
    fs.unlinkSync(filePath);

    // Save note info in DB
    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
      fileUrl: response.data.link, // ✅ This will be public downloadable link
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
    const notes = await Note.find({ uploadedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching user notes:", err);
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
});

module.exports = router;
