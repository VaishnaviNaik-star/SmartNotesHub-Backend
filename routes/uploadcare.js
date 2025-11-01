const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// ✅ Store uploaded file permanently on Uploadcare
router.post("/store", async (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ success: false, message: "UUID missing" });
  }

  try {
    // 🔍 Debug check — log keys once (remove later)
    console.log("UPLOADCARE_PUBLIC_KEY:", process.env.UPLOADCARE_PUBLIC_KEY);
    console.log("UPLOADCARE_SECRET_KEY:", process.env.UPLOADCARE_SECRET_KEY ? "Loaded ✅" : "Missing ❌");

    // ✅ PUT request to store file permanently
    const response = await axios.put(
      `https://api.uploadcare.com/files/${uuid}/storage/`,
      {},
      {
        headers: {
          Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        },
      }
    );

    // ✅ Success response
    res.json({
      success: true,
      message: "✅ File stored permanently",
      fileUrl: `https://ucarecdn.com/${uuid}/`,
    });
  } catch (error) {
    console.error("❌ Uploadcare store error:", error.response?.data || error.message);

    // Better error details
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data || "Failed to store file",
    });
  }
});

module.exports = router;
