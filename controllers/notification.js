const { StatusCodes } = require("http-status-codes");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { getDetailedTweets } = require("../utils");

const getNotifications = async (req, res) => {
  const { userId } = req.user;
  const notifications = await Notification.find({ recipient: userId })
    .sort("-createdAt")
    .populate("sender", "name username avatar")
    .populate("tweet")
    .populate("repliedTweet")
    .lean();

  const detailedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      if (notification.type === "reply") {
        let repliedTweet = await getDetailedTweets(
          [notification.repliedTweet],
          req.user
        );
        return { ...notification, repliedTweet: repliedTweet[0] };
      }
      return notification;
    })
  );

  res.status(StatusCodes.OK).json({
    nbHits: detailedNotifications.length,
    response: detailedNotifications,
  });
};

// const { userId } = req.user;

// const page = Number(req.query.page) || 1;
// const limit = Number(req.query.limit) || 10;
// const skip = (page - 1) * limit;

// const notifications = await Notification.find({ recipient: userId })
//   .sort("-createdAt")
//   .skip(skip)
//   .limit(limit)
//   .populate("sender", "name username avatar")
//   .populate("tweet", "content media");

// res.status(StatusCodes.OK).json({
//   page,
//   limit,
//   nbHits: notifications.length,
//   response: notifications,
// });

const getUnreadNotificationsCount = async (req, res) => {
  const { userId } = req.user;
  const notificationsCount = await Notification.countDocuments({
    recipient: userId,
  });

  res.status(StatusCodes.OK).send({
    count: notificationsCount,
  });
};

const clearUnreadNotificationsCount = async (req, res) => {
  const { userId } = req.user;
  await User.findByIdAndUpdate(userId, {
    $set: { unreadNotificationsCount: 0 },
  });
  res.status(StatusCodes.OK).send({
    message: "Unread notifications count cleared",
  });
};

module.exports = {
  getNotifications,
  getUnreadNotificationsCount,
  clearUnreadNotificationsCount,
};
