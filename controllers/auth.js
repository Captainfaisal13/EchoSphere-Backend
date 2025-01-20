const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const crypto = require("crypto");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");

const signUp = async (req, res) => {
  const user = await User.create({ ...req.body });
  const tokenUser = createTokenUser(user);

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const token = await Token.create({ refreshToken, user: user._id });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.CREATED).json({ response: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // check if user is registered using email
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Password");
  }

  const tokenUser = createTokenUser(user);

  // check for exisiting token
  let refreshToken = "";
  const exisitingToken = await Token.findOne({ user: user._id });

  if (exisitingToken) {
    refreshToken = exisitingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ response: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const token = await Token.create({ refreshToken, user: user._id });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ response: tokenUser });
};

const logout = async (req, res) => {
  console.log({ user: req.user });

  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
  });
  res.status(StatusCodes.OK).json({ response: "user logged out!" });
};

module.exports = { signUp, login, logout };
