const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    hostname: { type: String },
    platform: { type: String },
    networkInterfaces: [{ type: String }],
    ip: { type: String },
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date, default: null }, 
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password at least 6 chars"],
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    loginHistory: [loginHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
