const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");
const optionalAuthenticationMiddleware = require("../middleware/optionalAuthentication");

// multer setup
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const {
  getAllTweets,
  createTweet,
  getSingleTweet,
  updateTweet,
  deleteTweet,
} = require("../controllers/tweet");

router
  .route("/")
  .post(
    [authenticationMiddleware, upload.fields([{ name: "media", maxCount: 4 }])],
    createTweet
  );
router
  .route("/:userId/tweets")
  .get(optionalAuthenticationMiddleware, getAllTweets);
router
  .route("/:tweetId")
  .get(optionalAuthenticationMiddleware, getSingleTweet)
  .patch(
    [authenticationMiddleware, upload.fields([{ name: "media", maxCount: 4 }])],
    updateTweet
  )
  .delete(authenticationMiddleware, deleteTweet);

module.exports = router;
