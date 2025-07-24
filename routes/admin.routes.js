const express = require("express");
const authenticateToken = require("../middleware/auth");
const logger = require("../utils/logger");
const { getUsers } = require("../controllers/usersController");

const router = express.Router();

router.get("/getusers", authenticateToken, getUsers);

module.exports = router;
