const express = require("express");
const router = express.Router();
const fs = require("fs");
const authenticationMiddleware = require("../middleware/authentication");
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

const { signUp, login, updateUser } = require("../controllers/auth");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router
  .route("/updateUser")
  .patch(
    [
      authenticationMiddleware,
      upload.fields([{ name: "avatar" }, { name: "cover" }]),
    ],
    updateUser
  );

module.exports = router;
