const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");

const {
  getAllTweets,
  createTweet,
  getSingleTweet,
  updateTweet,
  deleteTweet,
} = require("../controllers/tweet");

router.route("/").post(authenticationMiddleware, createTweet);
router.route("/:userId/tweets").get(getAllTweets);
router
  .route("/:tweetId")
  .get(getSingleTweet)
  .patch(authenticationMiddleware, updateTweet)
  .delete(authenticationMiddleware, deleteTweet);

module.exports = router;
