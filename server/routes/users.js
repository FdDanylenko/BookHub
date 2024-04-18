const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
  getUserData,
  handleNewUser,
  handleAuth,
  handleLogout,
  handleRefreshToken,
  handleUpdateProfile,
} = require("../controllers/usersController");
const router = express.Router();

router.route("/").post(getUserData);
router.route("/register").post(handleNewUser);
router.route("/login").post(handleAuth);
router.route("/logout").post(handleLogout);
router.route("/refresh").post(handleRefreshToken);
router.route("/update").post(verifyJWT, handleUpdateProfile);

module.exports = router;
