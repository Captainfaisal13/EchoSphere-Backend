const {
  getNotifications,
  getUnreadNotificationsCount,
  clearUnreadNotificationsCount,
} = require("../controllers/notification");
const authenticationMiddleware = require("../middleware/authentication");

const express = require("express");
const router = express.Router();

// For GET request to get all notifications
router.route("/").get(authenticationMiddleware, getNotifications);

// For POST request to get unread notifications count
router
  .route("/unreadNotificationsCount")
  .get(authenticationMiddleware, getUnreadNotificationsCount);

// For POST request to clear unread notifications count
router
  .route("/clearUnreadNotificationsCount")
  .post(authenticationMiddleware, clearUnreadNotificationsCount);

module.exports = router;
