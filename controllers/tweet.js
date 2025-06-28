const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { StatusCodes } = require("http-status-codes");

const Tweet = require("../models/Tweet");
const { NotFoundError, BadRequestError } = require("../errors");
const Liketweet = require("../models/Liketweet");
const Retweet = require("../models/Retweet");
const { getDetailedTweets, fetchParents, fetchReplies } = require("../utils");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { pushNotification } = require("../utils/pushNotification");

const getAllTweets = async (req, res) => {
  const { userId } = req.params;
  const tweets = await Tweet.find({ user: userId }).sort("-createdAt").lean();

  const detailedTweets = await getDetailedTweets(tweets, req.user);

  res
    .status(StatusCodes.OK)
    .json({ nbHits: detailedTweets.length, detailedTweets });
};

const createTweet = async (req, res) => {
  const { userId, name, username, avatar } = req.user;
  const { content, parentTweet: parentTweetId } = req.body;
  const filesFields = req.files;
  let mediaUrls = [];
  if (filesFields && filesFields.media) {
    // console.log(filesFields.media);
    const mediaUrlsPromises = filesFields.media.map(async (mediaItem) => {
      const filePath = mediaItem.path;
      let resourceType = "image"; // Default resource type

      // Determine if the file is a video based on its extension
      if (filePath.match(/\.(mp4|webm|mkv|mov)$/i)) {
        resourceType = "video";
      }

      const res = await cloudinary.uploader.upload(filePath, {
        use_filename: true,
        folder: "tweetMedia",
        resource_type: resourceType,
      });
      fs.unlinkSync(path.join(filePath));
      // console.log(res.secure_url);
      return res.secure_url;
    });
    mediaUrls = await Promise.all(mediaUrlsPromises);
  }

  let parentTweet;
  if (parentTweetId) {
    parentTweet = await Tweet.findById(parentTweetId);

    if (!parentTweet) {
      throw new BadRequestError(
        `No such parent tweet with id : ${parentTweetId}`
      );
    }
  }

  const tweet = await Tweet.create({
    user: userId,
    name,
    username,
    userAvatar: avatar,
    media: mediaUrls,
    content,
    parentTweet: parentTweetId,
  });

  if (parentTweetId && parentTweet.user.toString() !== userId) {
    // creating notification when user is replying to a tweet
    await Notification.create({
      recipient: parentTweet.user,
      sender: userId,
      type: "reply",
      tweet: parentTweetId,
      repliedTweet: tweet._id,
    });

    await User.findByIdAndUpdate(parentTweet.user, {
      $inc: { unreadNotificationsCount: 1 },
    });
    // pushing notification to the user
    pushNotification(
      req,
      parentTweet.user.toString(),
      userId,
      "reply",
      `You got a reply from ${req.user.username}.`
    );
  }

  res.status(StatusCodes.CREATED).json({ tweet });
};

const getSingleTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findOne({ _id: tweetId }).lean();

  if (!tweet) {
    throw new NotFoundError(`No such tweet exist with id ${tweetId}`);
  }
  const parents = await fetchParents(tweetId);
  const replies = await fetchReplies(tweetId);

  const detailedTweets = await getDetailedTweets([tweet], req.user);
  const parentsDetailedTweet = await getDetailedTweets(parents, req.user);
  const repliesDetailedTweet = await getDetailedTweets(replies, req.user);

  res.status(StatusCodes.OK).json({
    response: {
      detailedTweet: detailedTweets[0],
      parentsDetailedTweet,
      repliesDetailedTweet,
    },
  });
};

const updateTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user;

  if (!req.body.content) {
    throw new BadRequestError("Content cannot be empty");
  }

  const isTweetExist = await Tweet.findOne({ _id: tweetId });

  if (!isTweetExist) {
    throw new NotFoundError(`No such tweet exist with tweet id ${tweetId}`);
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, user: userId },
    { ...req.body },
    { runValidators: true, new: true }
  );

  if (!tweet) {
    throw new BadRequestError(
      `tweet ${tweetId} deos not belong to user ${userId}`
    );
  }

  res.status(StatusCodes.OK).json({ tweet });
};

const deleteTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user;
  const isTweetExist = await Tweet.findOne({ _id: tweetId });

  if (!isTweetExist) {
    throw new NotFoundError(`No such tweet with tweet id ${tweetId}`);
  }

  const tweet = await Tweet.findOneAndDelete({ _id: tweetId, user: userId });

  if (!tweet) {
    throw new BadRequestError(
      `tweet ${tweetId} deos not belong to user ${userId}`
    );
  }
  const isReplyTweet = tweet.parentTweet;
  const deleteLikes = await Liketweet.deleteMany({ tweetId });
  const deleteRetweets = await Retweet.deleteMany({ tweetId });

  // deleting notification if it was a reply tweet
  if (isReplyTweet) {
    const parentTweet = await Tweet.findById(tweet.parentTweet);
    await Notification.findOneAndDelete({
      recipient: parentTweet.user,
      sender: userId,
      type: "reply",
      tweet: parentTweet._id,
      repliedTweet: tweet._id,
    });
    await User.findByIdAndUpdate(parentTweet.user, {
      $inc: { unreadNotificationsCount: -1 },
    });
  }

  res.status(StatusCodes.OK).send("Deleted Successfully");
};

module.exports = {
  getAllTweets,
  createTweet,
  getSingleTweet,
  updateTweet,
  deleteTweet,
};
