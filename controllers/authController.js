const User = require("../modal/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateUsername = require("../utils/generate_username");
const { MESSAGES } = require("../utils/constants");
const sendEmail = require("../utils/mailService");

exports.registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      mobile,
      email,
      password,
      confirmPassword,
      gender,
    } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    const username = await generateUsername(firstname, lastname, mobile);
    if (existingUser) {
      return res.status(400).json({ message: MESSAGES.USER_EXIST });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      mobile,
      email,
      password,
      confirmPassword,
      username,
      gender,
    });
    const name = `${firstname} ${lastname}`;
    await sendEmail(email, name, username);
    res.status(201).json({
      message: MESSAGES.USER_CREATED,
      userId: newUser._id,
      username: username,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  try {
    // 1. Find user by username
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({ error: MESSAGES.INVALID_CREDENTIALS });
      // next();
    }
    // 2. Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: MESSAGES.INVALID_CREDENTIALS,
      });
    }
    const { firstname, lastname, email, mobile } = user;
    // ✅ Update login data
    user.login_count += 1;
    user.lastLoginAt = new Date();
    user.login_history.push({
      loginAt: new Date(),
      ip,
      userAgent,
    });
    await user.save();

    // 3. Success — return token or user info
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );
    // Send token in secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 15 minutes
    });
    res.status(200).json({
      message: MESSAGES.LOGIN_SUCCESS,
      userId: user._id,
      firstname,
      lastname,
      email,
      mobile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token", { httpOnly: true, secure: true });
  return res.status(200).json({ message: "Logged out successfully" });
};
exports.profilecheck = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const user = await User.findOne({ username }).select(
      "-password -profile_edit_count -login_count -login_history -lastLoginAt -__v"
    );
    res.json({ user }); // send some basic info
  } catch (err) {
    res.sendStatus(401);
  }
};
