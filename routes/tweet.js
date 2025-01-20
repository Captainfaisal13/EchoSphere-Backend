const express = require("express");
const router = express.Router();
const os = require("os");
const path = require("path");
const fs = require("fs");
const authenticationMiddleware = require("../middleware/authentication");
const optionalAuthenticationMiddleware = require("../middleware/optionalAuthentication");

// multer setup
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tmpDir = path.join(os.tmpdir(), "my-uploads");
    fs.mkdirSync(tmpDir, { recursive: true }); // Ensure the directory exists
    cb(null, tmpDir);
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
