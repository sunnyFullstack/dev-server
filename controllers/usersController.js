const jwt = require("jsonwebtoken");
const User = require("../modal/User");
const decodeToken = require("../utils/decodeToken");

exports.getUsers = async (req, res, next) => {
  const decoded = decodeToken(req, res);
  console.log("call", decoded);
  try {
    const myId = decoded.id; // or req.user._id depending on how you store the ID
    const otherUsers = await User.find({ _id: { $ne: myId } }); // $ne = not equal
    if (otherUsers.length > 0) {
      res.status(200).json({ msg: "list users", data: otherUsers });
    } else {
      const onlyMe = await User.find();
      res.status(201).json({ msg: "users is not exist ", data: onlyMe });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
