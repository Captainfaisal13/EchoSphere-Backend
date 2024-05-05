const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id"],
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide follower id"],
  },
});

module.exports = mongoose.model("Follower", FollowerSchema);
