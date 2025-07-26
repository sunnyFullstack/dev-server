const express = require("express");
const authenticateToken = require("../middleware/auth");
const logger = require("../utils/logger");
const { getUsers, getyourMatch } = require("../controllers/usersController");

const router = express.Router();

router.get("/getusers", authenticateToken, getUsers);
router.post("/match", authenticateToken, getyourMatch);

module.exports = router;
