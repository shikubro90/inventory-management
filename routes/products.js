const express = require('express')
const router = express.Router()
const protect = require('../middleWares/auth')
const { createProduct, getProducts } = require('../controllers/products')
const { upload } = require('../utils/fileUpload')

router.post('/', protect, upload.single('image'), createProduct)
router.get('/', protect, getProducts)

module.exports = router
