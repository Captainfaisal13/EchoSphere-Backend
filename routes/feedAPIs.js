const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");
const {
  forYouFeed,
  followingFeed,
  recentsFeed,
  textFeed,
  photosFeed,
  videosFeed,
  getUser,
} = require("../controllers/feedAPIs");

// router.route("/foryou").get(authenticationMiddleware, forYouFeed);
router.route("/following").get(authenticationMiddleware, followingFeed);
router.route("/recents").get(recentsFeed);
router.route("/text").get(textFeed);
router.route("/photos").get(photosFeed);
router.route("/videos").get(videosFeed);
router.route("/user/:username").get(getUser);

module.exports = router;
