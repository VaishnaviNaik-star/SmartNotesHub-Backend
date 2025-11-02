const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// ✅ Permanently store uploaded file and return working CDN URL
router.post("/store", async (req, res) => {
  const { uuid, filename } = req.body;
  if (!uuid || !filename) {
    return res.status(400).json({ success: false, message: "UUID or filename missing" });
  }

  try {
    await axios.put(
      `https://api.uploadcare.com/files/${uuid}/storage/`,
      {},
      {
        headers: {
          Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        },
      }
    );

    // ✅ Use your project-specific CDN domain and encode filename
    const encodedFilename = encodeURIComponent(filename);
    const fileUrl = `https://20bnei1lnu.ucarecd.net/${uuid}/${encodedFilename}`;

    return res.json({
      success: true,
      message: "File stored permanently",
      fileUrl,
    });
  } catch (error) {
    console.error("Uploadcare store error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to store file" });
  }
});

module.exports = router;
