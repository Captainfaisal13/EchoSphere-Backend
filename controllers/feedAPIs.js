const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const Follower = require("../models/Follower");
const { NotFoundError } = require("../errors");
const getDetailedTweets = require("../utils/detailedTweets");

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
  res.send("Following feed");
};

const followingFeed = async (req, res) => {
  const { userId } = req.user;
  const followingFollower = await Follower.find({ userId });
  const followingUsersIds = [];

  followingFollower.forEach((item) => {
    followingUsersIds.push(item.followerId);
  });

  // console.log(followingUsersIds);

  const tweets = await Tweet.find({
    user: { $in: [...followingUsersIds, userId] },
  })
    .sort("-createdAt")
    .lean();

  // console.log({ tweets });

  const followingTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({ followingTweets });
  // const tweets = Tweet.find({})
};

const recentsFeed = async (req, res) => {
  const tweets = await Tweet.find({}).sort("-createdAt").lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({ AllTweets });
};

const textFeed = async (req, res) => {
  const tweets = await Tweet.find({}).sort("-createdAt").lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({ AllTweets });
};

const photosFeed = async (req, res) => {
  const tweets = await Tweet.find({}).sort("-createdAt").lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({ AllTweets });
};

const videosFeed = async (req, res) => {
  // console.log(req.user);

  const tweets = await Tweet.find({}).sort("-createdAt").lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({ AllTweets });
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
