const { StatusCodes } = require("http-status-codes");
const Tweet = require("../models/Tweet");
const { BadRequestError, NotFoundError } = require("../errors");
const BookmarkTweet = require("../models/BookmarkTweet");

const bookmarkUnbookmarkTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user;
  const tweet = await Tweet.findOne({ _id: tweetId });

  if (!tweet) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }

  const unbookmark = await BookmarkTweet.findOneAndDelete({ userId, tweetId });

  if (!unbookmark) {
    const bookmark = await BookmarkTweet.create({ userId, tweetId });
    return res.status(StatusCodes.CREATED).json({ bookmark });
  }
  res.status(StatusCodes.CREATED).json({ unbookmark });
};

const getAllbookmarkTweets = async (req, res) => {
  const { userId } = req.user;
  const bookmarks = await BookmarkTweet.find({ userId });
  res.status(StatusCodes.OK).json({ bookmarks });
};

module.exports = { bookmarkUnbookmarkTweet, getAllbookmarkTweets };
