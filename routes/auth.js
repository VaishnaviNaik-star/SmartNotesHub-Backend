const express = require("express");
const { signup, login } = require("../controllers/authController");
const router = express.Router();

// ✅ Change this from '/signup' → '/register'
router.post("/register", signup);
router.post("/login", login);

module.exports = router;
