const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: String, default: "Admin" }
});

module.exports = mongoose.model("Note", noteSchema);
