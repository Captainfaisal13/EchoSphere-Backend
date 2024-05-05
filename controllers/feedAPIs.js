const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { NotFoundError } = require("../errors");

const getUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) {
    throw new NotFoundError(`No such user exists with username ${username}`);
  }

  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      cover: user.cover,
      followers_count: 100,
      following_count: 10,
    },
  });
};

const forYouFeed = async (req, res) => {
  res.send("For you feed");
};
const followingFeed = async (req, res) => {
  res.send("Following feed");
};
const recentsFeed = async (req, res) => {
  res.send("Recents feed");
};
const textFeed = async (req, res) => {
  res.send("Text feed");
};
const photosFeed = async (req, res) => {
  res.send("Photos feed");
};
const videosFeed = async (req, res) => {
  res.send("Videos feed");
};

module.exports = {
  forYouFeed,
  followingFeed,
  recentsFeed,
  textFeed,
  photosFeed,
  videosFeed,
  getUser,
};
