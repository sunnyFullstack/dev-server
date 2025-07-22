const express = require("express");
const authenticateToken = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/admin", authenticateToken, (req, res, next) => {
  const token = req.cookies.token;
  logger.info(token, "tokens")
  res.json({
    message: "we called admin route",
  });
  next();
});

module.exports = router;
