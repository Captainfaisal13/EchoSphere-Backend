const Follower = require("../models/Follower");
const User = require("../models/User");

const getDetailedUser = async (users, loggedUser, queryType = "none") => {
  const detailedUsersPromises = users.map(async (singleUser) => {
    let isFollowed = false;
    if (loggedUser) {
      isFollowed = await Follower.exists({
        userId: loggedUser?.userId,
        followerId:
          queryType === "none"
            ? singleUser._id
            : queryType === "followers"
            ? singleUser.userId
            : singleUser.followerId,
      });
    }

    if (queryType === "none") {
      return { ...singleUser, isFollowed: !!isFollowed };
    }

    const user = await User.findOne({
      _id:
        queryType === "followers" ? singleUser.userId : singleUser.followerId,
    });

    return {
      ...singleUser,
      isFollowed: !!isFollowed,
      userAvatar: user.avatar,
      username: user.username,
      name: user.name,
    };
  });

  return await Promise.all(detailedUsersPromises);
};

module.exports = getDetailedUser;
