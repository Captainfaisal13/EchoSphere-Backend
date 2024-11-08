const express = require("express");
const router = express.Router();

const {
  followUnfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/follower");

const authenticationMiddleware = require("../middleware/authentication");
const optionalAuthenticationMiddleware = require("../middleware/optionalAuthentication");

router.route("/:userId").post(authenticationMiddleware, followUnfollowUser);
router
  .route("/:userId/followers")
  .get(optionalAuthenticationMiddleware, getFollowers);
router
  .route("/:userId/followings")
  .get(optionalAuthenticationMiddleware, getFollowing);
module.exports = router;
