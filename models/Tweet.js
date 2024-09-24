const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    user: {
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
      default: null,
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
    name: {
      type: String,
      required: [true, "Please provide user display name"],
    },
  },
  { timestamps: true }
);

TweetSchema.methods.uploadFile = async function (filePath) {
  const res = await cloudinary.uploader.upload(filePath, {
    use_filename: true,
    folder: "tweetMedia",
  });
  fs.unlinkSync(path.join(filePath));
  console.log(res.secure_url);
  return res.secure_url;
};

module.exports = mongoose.model("Tweet", TweetSchema);
