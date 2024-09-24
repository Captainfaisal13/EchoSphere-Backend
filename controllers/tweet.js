const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { StatusCodes } = require("http-status-codes");

const Tweet = require("../models/Tweet");
const { NotFoundError, BadRequestError } = require("../errors");
const Liketweet = require("../models/Liketweet");
const Retweet = require("../models/Retweet");

const getAllTweets = async (req, res) => {
  const { userId } = req.params;
  const tweets = await Tweet.find({ user: userId }).sort("-createdAt").lean();

  const detailedTweetsPromises = tweets.map(async (singleTweet) => {
    const likesOfTweet = await Liketweet.countDocuments({
      tweetId: singleTweet._id,
    });
    const retweetsOfTweet = await Retweet.countDocuments({
      tweetId: singleTweet._id,
    });
    return {
      ...singleTweet,
      likes_count: likesOfTweet,
      retweets_count: retweetsOfTweet,
    };
  });

  const detailedTweets = await Promise.all(detailedTweetsPromises);

  res
    .status(StatusCodes.OK)
    .json({ nbHits: detailedTweets.length, detailedTweets });
};

const createTweet = async (req, res) => {
  const { userId, name, username, avatar } = req.user;
  const { content, parentTweet } = req.body;
  const filesFields = req.files;
  let mediaUrls = [];
  if (filesFields && filesFields.media) {
    // console.log(filesFields.media);
    const mediaUrlsPromises = filesFields.media.map(async (mediaItem) => {
      const filePath = mediaItem.path;
      const res = await cloudinary.uploader.upload(filePath, {
        use_filename: true,
        folder: "tweetMedia",
      });
      fs.unlinkSync(path.join(filePath));
      // console.log(res.secure_url);
      return res.secure_url;
    });
    mediaUrls = await Promise.all(mediaUrlsPromises);
  }

  const tweet = await Tweet.create({
    user: userId,
    name,
    username,
    userAvatar: avatar,
    media: mediaUrls,
    content,
    parentTweet,
  });
  res.status(StatusCodes.CREATED).json({ tweet });
};

const getSingleTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findOne({ _id: tweetId }).lean();

  if (!tweet) {
    throw new NotFoundError(`No such tweet exist with id ${tweetId}`);
  }

  const likesOfTweet = await Liketweet.countDocuments({
    tweetId: tweetId,
  });
  const retweetsOfTweet = await Retweet.countDocuments({
    tweetId: tweetId,
  });

  const detailedTweet = {
    ...tweet,
    likes_count: likesOfTweet,
    retweets_count: retweetsOfTweet,
  };

  res.status(StatusCodes.OK).json({ detailedTweet });
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

  const deleteLikes = await Liketweet.deleteMany({ tweetId });
  const deleteRetweets = await Retweet.deleteMany({ tweetId });

  res.status(StatusCodes.OK).send("Deleted Successfully");
};

module.exports = {
  getAllTweets,
  createTweet,
  getSingleTweet,
  updateTweet,
  deleteTweet,
};
