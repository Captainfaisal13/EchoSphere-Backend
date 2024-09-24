const express = require("express");
const router = express.Router();

const {
  followUnfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/follower");

const authenticationMiddleware = require("../middleware/authentication");

router.route("/:userId").post(authenticationMiddleware, followUnfollowUser);
router.route("/:userId/followers").get(getFollowers);
router.route("/:userId/followings").get(getFollowing);
module.exports = router;
