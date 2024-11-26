const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const Follower = require("../models/Follower");
const { NotFoundError } = require("../errors");
const getDetailedTweets = require("../utils/detailedTweets");
const getDetailedUser = require("../utils/detailedUsers");
const Liketweet = require("../models/Liketweet");

const getUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new NotFoundError(`No such user exists with username ${username}`);
  }

  const detailedUser = await getDetailedUser([user], req.user);

  const followers = await Follower.countDocuments({
    followerId: user._id,
  });
  const followings = await Follower.countDocuments({
    userId: user._id,
  });

  res.status(StatusCodes.CREATED).json({
    response: {
      ...detailedUser[0],
      followerCount: followers,
      followingCount: followings,
    },
  });
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new NotFoundError(`No such user exists with username ${username}`);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({
    user: user._id,
    parentTweet: { $eq: null },
  })
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();

  const detailedTweets = await getDetailedTweets(tweets, req.user);
  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: detailedTweets.length,
    response: detailedTweets,
  });
};

const getUserReplies = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new NotFoundError(`No such user exists with username ${username}`);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({
    user: user._id,
    parentTweet: { $ne: null },
  })
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();

  const detailedTweets = await getDetailedTweets(tweets, req.user);
  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: detailedTweets.length,
    response: detailedTweets,
  });
};

const getUserLikes = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new NotFoundError(`No such user exists with username ${username}`);
  }

  const likedTweets = await Liketweet.find({ userId: user._id })
    .sort("-createdAt")
    .lean();

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({
    _id: { $in: likedTweets.map((like) => like.tweetId) },
  })
    .skip(skip)
    .limit(limit)
    .lean();

  const detailedTweets = await getDetailedTweets(tweets, req.user);
  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: detailedTweets.length,
    response: detailedTweets,
  });
};

const getUserMedia = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new NotFoundError(`No such user exists with username ${username}`);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({ user: user._id })
    .skip(skip)
    .limit(limit)
    .lean();

  const detailedTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: detailedTweets.length,
    response: detailedTweets,
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

  let tweets = Tweet.find({
    user: { $in: [...followingUsersIds, userId] },
  })
    .sort("-createdAt")
    .lean();

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  tweets = await tweets.skip(skip).limit(limit);

  const followingTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: followingTweets.length,
    response: followingTweets,
  });
};

const recentsFeed = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({})
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: AllTweets.length,
    response: AllTweets,
  });
};

const textFeed = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({})
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: AllTweets.length,
    response: AllTweets,
  });
};

const photosFeed = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({})
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: AllTweets.length,
    response: AllTweets,
  });
};

const videosFeed = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({})
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();
  const AllTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: AllTweets.length,
    response: AllTweets,
  });
};

module.exports = {
  forYouFeed,
  followingFeed,
  recentsFeed,
  textFeed,
  photosFeed,
  videosFeed,
  getUser,
  getUserPosts,
  getUserReplies,
  getUserLikes,
  getUserMedia,
};
