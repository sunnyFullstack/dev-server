const express = require("express");
const {
  registerUser,
  loginUser,
  profilecheck,
  logout,
} = require("../controllers/authController");

require("dotenv").config();

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/profile", profilecheck);

module.exports = router;
