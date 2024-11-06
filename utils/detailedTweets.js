const Liketweet = require("../models/Liketweet");
const Retweet = require("../models/Retweet");
const Tweet = require("../models/Tweet");

const getDetailedTweets = async (tweets, user) => {
  const detailedTweetsPromises = tweets.map(async (singleTweet) => {
    const likesOfTweet = await Liketweet.countDocuments({
      tweetId: singleTweet._id,
    });
    const retweetsOfTweet = await Retweet.countDocuments({
      tweetId: singleTweet._id,
    });
    const repliesOfTweet = await Tweet.countDocuments({
      parentTweet: singleTweet._id,
    });

    let isLiked = false;
    if (user) {
      isLiked = await Liketweet.exists({
        userId: user.userId,
        tweetId: singleTweet._id,
      });
    }

    let isRepost = false;
    if (user) {
      isRepost = await Retweet.exists({
        userId: user.userId,
        tweetId: singleTweet._id,
      });
    }

    return {
      ...singleTweet,
      likes_count: likesOfTweet,
      retweets_count: retweetsOfTweet,
      replies_count: repliesOfTweet,
      isLiked: !!isLiked,
      isRepost: !!isRepost,
    };
  });

  return await Promise.all(detailedTweetsPromises);
};

module.exports = getDetailedTweets;
