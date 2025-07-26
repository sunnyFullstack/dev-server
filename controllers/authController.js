const User = require("../modal/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateUsername = require("../utils/generate_username");
const { MESSAGES } = require("../utils/constants");
const sendEmail = require("../utils/mailService");
const decodeToken = require("../utils/decodeToken");

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
  console.log("username", username);
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
  try {
    const decoded = decodeToken(req, res, next);
    const username = decoded.username;
    const user = await User.findOne({ username }).select(
      "-password -profile_edit_count -login_count -login_history -lastLoginAt -__v"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    const requiredFields = [
      "firstname",
      "lastname",
      "mobile",
      "username",
      "email",
      "gender",
      "work_location.state",
      "work_location.district",
      "work_location.block",
      "work_location.village",
      "desired_transfer_location.state",
      "desired_transfer_location.district",
      "desired_transfer_location.block",
      "desired_transfer_location.village",
      "school_info.school_name",
      "school_info.school_u_dise",
    ];
    const missingFields = requiredFields.filter((path) => {
      const keys = path.split(".");
      let value = user;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === null || value === "") {
          return true;
        }
      }
      return false;
    });
    if (missingFields.length > 0) {
      return res.status(200).json({
        data: user,
        missingFields: missingFields,
        message: "profile isn't completed!",
        isProfileComplete: false,
      });
    }
    res.status(200).json({ data: user, message: "user found" }); // send some basic info
  } catch (err) {
    res.sendStatus(401);
  }
};
exports.profileEdit = async (req, res) => {
  try {
    const decoded = decodeToken(req, res);
    const userId = decoded.id;

    const {
      firstname,
      lastname,
      mobile,
      email,
      gender,
      schoolname,
      schoolcode,
      teachercode,
      classgroup,
      subjectname,
      state,
      district,
      block,
      village,
      t_state,
      t_district,
      t_block,
      t_village,
      password,
    } = req.body;

    const updates = {
      firstname,
      lastname,
      mobile,
      email,
      gender,
      work_location: {
        state,
        district,
        block,
        village,
      },
      desired_transfer_location: {
        state: t_state,
        district: t_district,
        block: t_block,
        village: t_village,
      },
      school_info: {
        school_name: schoolname,
        school_u_dise: schoolcode,
      },
      teachercode,
      classgroup,
      subjectname,
    };

    // If password is given, hash it
    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
