const { StatusCodes } = require("http-status-codes");
const Follower = require("../models/Follower");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");

const followUnfollowUser = async (req, res) => {
  const { userId: followerId } = req.params;
  const { userId: followingId } = req.user;

  const follower = await User.findOne({ _id: followerId });

  if (!follower) {
    throw new NotFoundError(`No user exists with user id ${followerId}`);
  }

  const unfollowed = await Follower.findOneAndDelete({
    userId: followingId,
    followerId,
  });

  if (!unfollowed) {
    // user is asking to follow
    const followed = await Follower.create({ userId: followingId, followerId });
    return res.status(StatusCodes.OK).send({ followed });
  }
  res.status(StatusCodes.OK).send({ unfollowed });
};

const getFollowers = async (req, res) => {
  const { userId } = req.params;
  const followers = await Follower.find({ followerId: userId });
  res.status(StatusCodes.OK).send({ followers });
};

const getFollowing = async (req, res) => {
  const { userId } = req.params;
  const following = await Follower.find({ userId });
  res.status(StatusCodes.OK).send({ following });
};

module.exports = { followUnfollowUser, getFollowers, getFollowing };
