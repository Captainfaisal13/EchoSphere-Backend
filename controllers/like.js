const { StatusCodes } = require("http-status-codes");
const LikeTweet = require("../models/Liketweet");
const Tweet = require("../models/Tweet");
const { BadRequestError, NotFoundError } = require("../errors");
const Notification = require("../models/Notification");
const User = require("../models/User");

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

    console.log(
      tweet.user.toString(),
      userId,
      tweet.user === userId,
      tweet.user.toString() === userId
    );

    // condition to not to notify the user itself
    if (tweet.user.toString() !== userId) {
      // creating notification
      await Notification.create({
        recipient: tweet.user,
        sender: userId,
        type: "like",
        tweet: tweet._id,
      });
      await User.findByIdAndUpdate(tweet.user, {
        $inc: { unreadNotificationsCount: 1 },
      });
    }

    return res.status(StatusCodes.CREATED).json({ like });
  }

  // deleting notification
  if (tweet.user !== userId) {
    await Notification.findOneAndDelete({
      recipient: tweet.user,
      sender: userId,
      type: "like",
      tweet: tweet._id,
    });
    await User.findByIdAndUpdate(tweet.user, {
      $inc: { unreadNotificationsCount: -1 },
    });
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
