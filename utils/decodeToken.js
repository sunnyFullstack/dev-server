const jwt = require("jsonwebtoken");
const decodeToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new Error("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
};
module.exports = decodeToken;
