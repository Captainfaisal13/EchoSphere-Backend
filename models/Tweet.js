const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user id"],
    },
    content: {
      type: String,
      required: [true, "Please provide tweet content"],
    },
    parentTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    media: {
      type: [String],
    },
    userAvatar: {
      type: String,
      required: [true, "Please provide user avatar url"],
    },
    username: {
      type: String,
      required: [true, "Please provide username"],
    },
    userDisplayName: {
      type: String,
      required: [true, "Please provide user display name"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", TweetSchema);
