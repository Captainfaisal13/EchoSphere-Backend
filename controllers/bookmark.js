const { StatusCodes } = require("http-status-codes");
const Tweet = require("../models/Tweet");
const { BadRequestError, NotFoundError } = require("../errors");
const BookmarkTweet = require("../models/BookmarkTweet");
const { getDetailedTweets } = require("../utils");

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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const bookmarks = await BookmarkTweet.find({ userId })
    .skip(skip)
    .limit(limit)
    .lean();

  const tweets = await Tweet.find({
    _id: { $in: bookmarks.map((bookmark) => bookmark.tweetId) },
  }).lean();

  const detailedTweets = await getDetailedTweets(tweets, req.user);

  res.status(StatusCodes.OK).json({
    page,
    limit,
    nbHits: detailedTweets.length,
    response: detailedTweets,
  });
};

module.exports = { bookmarkUnbookmarkTweet, getAllbookmarkTweets };
