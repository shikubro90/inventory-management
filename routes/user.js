const express = require("express");
const router = express.Router();

const {registerUser, login} = require("../controllers/user")

router.post("/register", registerUser)
router.get("/login", login)


module.exports = router