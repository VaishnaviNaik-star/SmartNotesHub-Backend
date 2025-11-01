const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Store uploaded file permanently on Uploadcare
router.post("/store", async (req, res) => {
  const { uuid } = req.body;
  if (!uuid) {
    return res.status(400).json({ success: false, message: "UUID missing" });
  }

  try {
    const response = await axios.put(
      `https://api.uploadcare.com/files/${uuid}/storage/`,
      {},
      {
        headers: {
          Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        },
      }
    );

    res.json({
      success: true,
      message: "✅ File stored permanently",
      fileUrl: `https://ucarecdn.com/${uuid}/`,
    });
  } catch (error) {
    console.error("Uploadcare store error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to store file" });
  }
});

module.exports = router;
