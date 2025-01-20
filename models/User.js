const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    minLength: 3,
    maxLength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
  },
  username: {
    type: String,
    required: [true, "Please provide userid"],
    minLength: 3,
    maxLength: 30,
    unique: [true, "username must be unique"],
  },
  bio: {
    type: String,
    maxLength: 100,
  },
  avatar: {
    type: String,
    default: "/_assets/images/unknown-image.png",
  },
  cover: {
    type: String,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      username: this.username,
      avatar: this.avatar,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (cadidatePassword) {
  const isPasswordCorrect = await bcrypt.compare(
    cadidatePassword,
    this.password
  );
  return isPasswordCorrect;
};

UserSchema.methods.uploadFile = async function (filePath, field) {
  const res = await cloudinary.uploader.upload(filePath, {
    use_filename: true,
    folder: field,
  });
  fs.unlinkSync(path.join(filePath));
  // console.log(res.secure_url);
  return res.secure_url;
};

module.exports = mongoose.model("User", UserSchema);
