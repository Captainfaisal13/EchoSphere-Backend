const { StatusCodes } = require("http-status-codes");
const Follower = require("../models/Follower");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const getDetailedUser = require("../utils/detailedUsers");

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
  // logic to get the followers using userId or username through params by the help of queryParams
  const isUsername = req.query.isUsername;
  let { userId } = req.params;

  if (isUsername === "true") {
    const user = await User.findOne({ username: userId }).lean();
    if (!user) {
      throw new NotFoundError(
        `No such user exists with the username: ${userId}`
      );
    }
    userId = user._id;
  }

  const followers = await Follower.find({ followerId: userId }).lean();
  const detailedFollowers = await getDetailedUser(
    followers,
    req.user,
    "followers"
  );
  res.status(StatusCodes.OK).send({ detailedFollowers });
};

const getFollowing = async (req, res) => {
  const isUsername = req.query.isUsername;
  let { userId } = req.params;

  if (isUsername === "true") {
    const user = await User.findOne({ username: userId }).lean();
    if (!user) {
      throw new NotFoundError(
        `No such user exists with the username: ${userId}`
      );
    }
    userId = user._id;
  }
  const following = await Follower.find({ userId }).lean();
  const detailedFollowings = await getDetailedUser(
    following,
    req.user,
    "followings"
  );
  res.status(StatusCodes.OK).send({ detailedFollowings });
};

module.exports = { followUnfollowUser, getFollowers, getFollowing };
