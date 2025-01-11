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
  getUserReplies,
  getUserPosts,
  getUserLikes,
  getUserMedia,
  getUsers,
} = require("../controllers/feedAPIs");

// router.route("/foryou").get(authenticationMiddleware, forYouFeed);
router.route("/following").get(authenticationMiddleware, followingFeed);
router.route("/recents").get(optionalAuthenticationMiddleware, recentsFeed);
router.route("/text").get(optionalAuthenticationMiddleware, textFeed);
router.route("/photos").get(optionalAuthenticationMiddleware, photosFeed);
router.route("/videos").get(optionalAuthenticationMiddleware, videosFeed);
router
  .route("/user/:username/posts")
  .get(optionalAuthenticationMiddleware, getUserPosts);
router
  .route("/user/:username/replies")
  .get(optionalAuthenticationMiddleware, getUserReplies);
router
  .route("/user/:username/media")
  .get(optionalAuthenticationMiddleware, getUserMedia);
router
  .route("/user/:username/likes")
  .get(optionalAuthenticationMiddleware, getUserLikes);
router.route("/user/:username").get(optionalAuthenticationMiddleware, getUser);
router.route("/getUsers").get(optionalAuthenticationMiddleware, getUsers);

module.exports = router;
