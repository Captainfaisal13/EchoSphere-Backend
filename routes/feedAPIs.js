const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");
const optionalAuthenticationMiddleware = require("../middleware/optionalAuthentication");
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
router.route("/recents").get(optionalAuthenticationMiddleware, recentsFeed);
router.route("/text").get(optionalAuthenticationMiddleware, textFeed);
router.route("/photos").get(optionalAuthenticationMiddleware, photosFeed);
router.route("/videos").get(authenticationMiddleware, videosFeed);
router.route("/user/:username").get(getUser);

module.exports = router;
