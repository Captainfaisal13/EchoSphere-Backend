const { StatusCodes } = require("http-status-codes");
const Retweet = require("../models/Retweet");
const Tweet = require("../models/Tweet");
const { BadRequestError, NotFoundError } = require("../errors");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { pushNotification } = require("../utils/pushNotification");

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

    // creating notification
    if (tweet.user.toString() !== userId) {
      await Notification.create({
        recipient: tweet.user,
        sender: userId,
        type: "retweet",
        tweet: tweet._id,
      });
      await User.findByIdAndUpdate(tweet.user, {
        $inc: { unreadNotificationsCount: 1 },
      });
      // pushing notification to the user
      pushNotification(
        req,
        tweet.user.toString(),
        userId,
        "retweet",
        `Your echo got retweeted by ${req.user.username}.`
      );
    }
    return res.status(StatusCodes.CREATED).json({ retweet });
  }

  // deleting notification
  await Notification.findOneAndDelete({
    recipient: tweet.user,
    sender: userId,
    type: "retweet",
    tweet: tweet._id,
  });

  await User.findByIdAndUpdate(tweet.user, {
    $inc: { unreadNotificationsCount: -1 },
  });

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
