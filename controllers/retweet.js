const { StatusCodes } = require("http-status-codes");
const Retweet = require("../models/Retweet");
const Tweet = require("../models/Tweet");
const { BadRequestError, NotFoundError } = require("../errors");

const retweetTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user;

  const tweet = await Tweet.findOne({ _id: tweetId });

  if (!tweet) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }

  const undoretweet = await Retweet.findOneAndDelete({ userId, tweetId });

  if (!undoretweet) {
    const retweet = await Retweet.create({ userId, tweetId });
    return res.status(StatusCodes.CREATED).json({ retweet });
  }
  res.status(StatusCodes.CREATED).json({ undoretweet });
};

const getAllRetweetsTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findOne({ _id: tweetId });

  if (!tweet) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }

  const retweets = await Retweet.find({ tweetId });
  res.status(StatusCodes.OK).json({ retweets });
};

module.exports = { retweetTweet, getAllRetweetsTweet };
