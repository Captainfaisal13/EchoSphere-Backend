const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");
const { shareTweet } = require("../controllers/share");

router.route("/:tweetId/share").post(authenticationMiddleware, shareTweet);
module.exports = router;
