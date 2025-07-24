const jwt = require("jsonwebtoken");
const decodeToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
  next();
};
module.exports = decodeToken;
