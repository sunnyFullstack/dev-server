const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 15,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 25,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    gender: {
      type: String,
      required: true,
    },
    work_location: {
      state: {
        type: String,
        // required: true,
        trim: true,
      },
      district: {
        type: String,
        // required: true,
        trim: true,
      },
      block: {
        type: String,
        // required: true,
        trim: true,
      },
    },
    desired_transfer_location: {
      state: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      block: {
        type: String,
        trim: true,
      },
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    school_info: {
      school_name: {
        type: String,
        trim: true,
      },
      school_u_dise: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    profile_img: {
      type: String,
      trim: true,
    },
    teacher_code: {
      type: String,
      trim: true,
    },
    class_group: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    profile_edit_count: {
      type: Number,
      default: 0,
    },
    login_count: {
      type: Number,
      default: 0,
    },
    lastLoginAt: Date,
    login_history: [
      {
        loginAt: Date,
        ip: String,
        userAgent: String,
      },
    ],
  },
  { times_tamps: true }
);

// Virtual field for confirm password
userSchema.virtual("confirmPassword").set(function (value) {
  this._confirmPassword = value;
});

userSchema.pre("validate", function (next) {
  if (this.isNew && this.password !== this._confirmPassword) {
    this.invalidate("confirmPassword", "Passwords do not match");
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
