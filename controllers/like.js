const { StatusCodes } = require("http-status-codes");
const LikeTweet = require("../models/Liketweet");
const Tweet = require("../models/Tweet");
const { BadRequestError, NotFoundError } = require("../errors");

const likeDislikeTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user;
  const tweet = await Tweet.findOne({ _id: tweetId });

  if (!tweet) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }

  const dislike = await LikeTweet.findOneAndDelete({ userId, tweetId });

  if (!dislike) {
    const like = await LikeTweet.create({ userId, tweetId });
    return res.status(StatusCodes.CREATED).json({ like });
  }
  res.status(StatusCodes.CREATED).json({ dislike });
};

const getAllLikesTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findOne({ _id: tweetId });

  if (!tweet) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }

  const likes = await LikeTweet.find({ tweetId });
  res.status(StatusCodes.OK).json({ likes });
};

module.exports = { likeDislikeTweet, getAllLikesTweet };
