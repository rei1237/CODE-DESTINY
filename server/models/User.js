const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const birthTimeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 40,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: emailRegex,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  birthDate: {
    type: String,
    required: true,
    match: birthDateRegex,
  },
  birthTime: {
    type: String,
    required: true,
    match: birthTimeRegex,
  },
  gender: {
    type: String,
    required: true,
    enum: ["M", "F", "OTHER"],
    default: "OTHER",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
