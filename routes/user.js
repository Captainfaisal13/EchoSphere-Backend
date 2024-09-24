const express = require("express");
const router = express.Router();
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

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
} = require("../controllers/user");

router.route("/").get(getAllUsers);
router.route("/showMe").get(authenticationMiddleware, showCurrentUser);
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
