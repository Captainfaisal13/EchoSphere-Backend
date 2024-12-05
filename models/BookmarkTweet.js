const mongoose = require("mongoose");

const BookmarkTweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user id"],
    },
    tweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: [true, "Please provide tweet id"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookmarkTweet", BookmarkTweetSchema);
