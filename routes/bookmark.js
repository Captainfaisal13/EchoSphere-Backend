const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");

const {
  getAllbookmarkTweets,
  bookmarkUnbookmarkTweet,
} = require("../controllers/bookmark");

router
  .route("/:tweetId/bookmark")
  .post(authenticationMiddleware, bookmarkUnbookmarkTweet);
router.route("/bookmarks").get(authenticationMiddleware, getAllbookmarkTweets);
module.exports = router;
