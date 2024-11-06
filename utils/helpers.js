const Tweet = require("../models/Tweet");

// Function to recursively fetch parent tweets
const fetchParents = async (tweetId, parents = []) => {
  const tweet = await Tweet.findOne({ _id: tweetId }).lean();
  if (tweet && tweet.parentTweet) {
    const parent = await Tweet.findOne({ _id: tweet.parentTweet }).lean();
    parents.unshift(parent); // Add parent at the beginning of the array
    return fetchParents(tweet.parentTweet, parents);
  }
  return parents;
};

// Function to recursively fetch replies for a tweet
const fetchReplies = async (tweetId) => {
  const replies = await Tweet.find({ parentTweet: tweetId });
  return Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await fetchReplies(reply._id);
      return { ...reply.toObject(), replies: nestedReplies };
    })
  );
};

module.exports = { fetchParents, fetchReplies };
