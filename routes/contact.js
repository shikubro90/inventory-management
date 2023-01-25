const express = require("express")
const { contact } = require("../controllers/contact")
const protect = require("../middleWares/auth")
const router = express.Router()

router.post("/contact",protect, contact)

module.exports = router;