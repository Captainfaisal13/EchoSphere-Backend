const express = require("express");
const router = express.Router();
const { signUp, login, logout } = require("../controllers/auth");
const authenticationMiddleware = require("../middleware/authentication");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").delete(authenticationMiddleware, logout);

module.exports = router;
