const express = require("express");
const router = express.Router();
const os = require("os");
const path = require("path");
const authenticationMiddleware = require("../middleware/authentication");
const fs = require("fs");

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
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  searchUsers,
} = require("../controllers/user");

router.route("/").get(getAllUsers);
router.route("/showMe").get(authenticationMiddleware, showCurrentUser);
router.route("/search").get(searchUsers);
router.route("/:id").get(getSingleUser);
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
