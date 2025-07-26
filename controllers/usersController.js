const jwt = require("jsonwebtoken");
const User = require("../modal/User");
const decodeToken = require("../utils/decodeToken");
const logger = require("../utils/logger");

exports.getUsers = async (req, res, next) => {
  const decoded = decodeToken(req, res);
  // console.log("call", decoded);
  try {
    const myId = decoded.id; // or req.user._id depending on how you store the ID
    const otherUsers = await User.find({ _id: { $ne: myId } }).select(
      "-password -profile_edit_count -login_count -login_history -lastLoginAt -__v"
    ); // $ne = not equal
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
exports.getyourMatch = async (req, res, next) => {
  const decoded = decodeToken(req, res);
  try {
    const myId = decoded.id; // or req.user._id depending on how you store the ID
    // console.log("body", req.body);
    const user = await User.find({
      _id: { $ne: myId },
      "desired_transfer_location.state": req?.body?.state,
      "desired_transfer_location.district": req?.body?.district,
      "desired_transfer_location.block": req?.body?.block,
      "desired_transfer_location.village": req?.body?.village,
      "school_info.school_name": req?.body?.school_name,
      "school_info.school_u_dise": req?.body?.school_name,
    }).select(
      "-password -profile_edit_count -login_count -login_history -lastLoginAt -__v"
    );
    console.log(user, "+++++", req.body);
    // const otherUsers = await User.findAll({ _id: { $ne: myId } }).where();
    res.json({ message: "data is found", data: user });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
