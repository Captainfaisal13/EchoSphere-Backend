const mongoose = require("mongoose");

const RetweetSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Retweet", RetweetSchema);
