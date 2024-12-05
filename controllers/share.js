const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Tweet = require("../models/Tweet");

const shareTweet = async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $inc: { shareCount: 1 },
    },
    { new: true }
  );

  if (!tweet) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }
  res.status(StatusCodes.CREATED).json({ tweet });
};

module.exports = { shareTweet };
