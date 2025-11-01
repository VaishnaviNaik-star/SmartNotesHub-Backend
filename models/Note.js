const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  uploadedByName: { type: String }, // ✅ add this line
  role: { type: String },
  uploadDate: { type: Date, default: Date.now },
});
