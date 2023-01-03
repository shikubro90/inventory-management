const express = require("express");
const router = express.Router();

const {registerUser, login, logout, getuser} = require("../controllers/user")
const protect = require("../middleWares/auth")

router.post("/register", registerUser)
router.get("/login",login)
router.get("/logout", logout)
router.get("/getuser",protect, getuser)

module.exports = router