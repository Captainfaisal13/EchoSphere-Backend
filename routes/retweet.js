const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");

const { retweetTweet, getAllRetweetsTweet } = require("../controllers/retweet");

router.route("/:tweetId/retweet").post(authenticationMiddleware, retweetTweet);
router.route("/:tweetId/retweets").get(getAllRetweetsTweet);
module.exports = router;
