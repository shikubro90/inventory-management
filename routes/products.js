const express = require("express")
const router = express.Router()
const protect = require("../middleWares/auth")
const createProducts = require("../controllers/products")
const {upload} = require("../utils/fileUpload")

router.post("/",protect, upload.single("image"),createProducts);

module.exports = router;