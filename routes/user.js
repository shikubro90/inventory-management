const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  logout,
  getuser,
  getLoginStatus,
  updateUser,
  changePassword,
} = require("../controllers/user");
const protect = require("../middleWares/auth");

router.post("/register", registerUser);
router.get("/login", login);
router.get("/logout", logout);
router.get("/getuser", protect, getuser);
router.get("/getloginstatus", getLoginStatus);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);

module.exports = router;
