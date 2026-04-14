const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Register API
router.post("/register", authController.registerUser);
// Login API
router.post("/login", authController.loginUser);

module.exports = router;
