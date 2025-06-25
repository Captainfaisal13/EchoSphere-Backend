const { StatusCodes } = require("http-status-codes");
const { OAuth2Client } = require("google-auth-library");

const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../errors");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const crypto = require("crypto");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

const signUp = async (req, res) => {
  const user = await User.create({ ...req.body });
  const tokenUser = createTokenUser(user);

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const token = await Token.create({ refreshToken, user: user._id });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.CREATED).json({
    response: {
      ...tokenUser,
      unreadNotificationsCount: user.unreadNotificationsCount,
    },
  });
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

  if (user.isOAuth && !user.password) {
    throw new BadRequestError(
      "This account was created via Google. Please log in with Google."
    );
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
    res.status(StatusCodes.OK).json({
      response: {
        ...tokenUser,
        unreadNotificationsCount: user.unreadNotificationsCount,
      },
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const token = await Token.create({ refreshToken, user: user._id });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({
    response: {
      ...tokenUser,
      unreadNotificationsCount: user.unreadNotificationsCount,
    },
  });
};

const loginWithGoogle = async (req, res) => {
  let idToken = "";
  if (req.body.loginType === "custom") {
    const { code } = req.body; // code from frontend google login
    const { tokens } = await oAuth2Client.getToken(code); // extracting tokens for user info
    idToken = tokens.id_token;
  } else {
    idToken = req.body.credential;
  }

  const ticket = await oAuth2Client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // auto-generating a username with the user email
    const generatedUsername =
      email.split("@")[0] + Math.floor(Math.random() * 10000);

    user = await User.create({
      name,
      email,
      username: generatedUsername,
      avatar: picture,
      isOAuth: true,
    });
  } else {
    // if user is already created with email/password signin form
    if (!user.isOAuth) {
      throw new ConflictError(
        "Email is already register, Please login with email and password"
      );
    }
  }

  // either new user or existing login with google user

  const tokenUser = createTokenUser(user);

  // check for exisiting token
  let refreshToken = "";
  const exisitingToken = await Token.findOne({ user: user._id });

  if (exisitingToken) {
    refreshToken = exisitingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({
      response: {
        ...tokenUser,
        unreadNotificationsCount: user.unreadNotificationsCount,
      },
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const token = await Token.create({ refreshToken, user: user._id });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({
    response: {
      ...tokenUser,
      unreadNotificationsCount: user.unreadNotificationsCount,
    },
  });
};

const logout = async (req, res) => {
  // console.log({ user: req.user });

  // Delete the refresh token from the database
  await Token.findOneAndDelete({ user: req.user.userId });

  // Clear accessToken cookie
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    // sameSite: "None",
    // secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent over HTTPS
    // path: "/", // Clear cookie on the entire domain
  });

  // Clear refreshToken cookie
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    // sameSite: "None",
    // secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent over HTTPS
    // path: "/", // Clear cookie on the entire domain
  });

  res.status(StatusCodes.OK).json({ response: "User logged out!" });
};

module.exports = { signUp, login, loginWithGoogle, logout };
