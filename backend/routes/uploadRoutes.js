const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { uploadImage } = require("../utils/cloudService");

router.post("/upload-image", authMiddleware, async (req, res) => {
  try {
    const results = await uploadImage(req.files);
    res.json({
      success: true,
      url: Array.isArray(results) ? results[0].secure_url : results.secure_url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
