const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");

const { likeDislikeTweet, getAllLikesTweet } = require("../controllers/like");

router.route("/:tweetId/like").post(authenticationMiddleware, likeDislikeTweet);
router.route("/:tweetId/likes").get(getAllLikesTweet);
module.exports = router;
