const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
