const express = require("express");
const router = express.Router();

const {
  followUnfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/follower");

const { getUser } = require("../controllers/auth");

const authenticationMiddleware = require("../middleware/authentication");

router.route("/:userId").get(getUser);
router
  .route("/:userId/follow")
  .post(authenticationMiddleware, followUnfollowUser);
router.route("/:userId/followers").get(getFollowers);
router.route("/:userId/following").get(getFollowing);
module.exports = router;
