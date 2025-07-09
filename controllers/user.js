const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const createTokenUser = require("../utils/createTokenUser");
const { attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user found with id:${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  res.status(StatusCodes.OK).json({
    user: {
      ...req.user,
      unreadNotificationsCount: user.unreadNotificationsCount,
    },
  });
};

const updateUser = async (req, res) => {
  const bodyFields = req.body;
  const filesFields = req.files;
  const user = await User.findOne({ _id: req.user.userId });

  if (bodyFields.email) {
    user.email = bodyFields.email;
  }

  if (bodyFields.username) {
    user.username = bodyFields.username;
  }

  if (bodyFields.name) {
    user.name = bodyFields.name;
  }

  if (bodyFields.bio) {
    user.bio = bodyFields.bio;
  }

  if (filesFields && filesFields.avatar) {
    user.avatar = await user.uploadFile(filesFields.avatar[0].path, "avatar");
  }

  if (filesFields && filesFields.cover) {
    user.cover = await user.uploadFile(filesFields.cover[0].path, "cover");
  }

  await user.save();

  const userTweets = await Tweet.updateMany(
    { user: req.user.userId },
    {
      $set: {
        userAvatar: user.avatar,
        name: user.name,
        username: user.username,
      },
    }
  );

  console.log({ userTweets });

  const tokenUser = createTokenUser(user);
  const token = await Token.findOne({ user: user._id });
  attachCookiesToResponse({
    res,
    user: tokenUser,
    refreshToken: token.refreshToken,
  });
  res.status(StatusCodes.OK).json({ response: user });
};

const searchUsers = async (req, res) => {
  const query = req.query.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!query || query.trim() === "") {
    throw new BadRequestError(`Query string is empty`);
  }

  const users = await User.find(
    {
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
      name: 1,
      username: 1,
      avatar: 1, // or profilePic
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    page,
    limit,
    nbHits: users.length,
    response: users,
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  searchUsers,
};
