const express = require('express')
const router = express.Router()
const protect = require('../middleWares/auth')
const {
  createProduct,
  getProducts,
  getProduct,
  removeProduct,
  updateProduct
  
} = require('../controllers/products')
const { upload } = require('../utils/fileUpload')

router.post('/uploadProduct', protect, upload.single('image'), createProduct)
router.get('/getProducts', protect, getProducts)
router.get('/getProduct/:id', protect, getProduct);
router.delete('/removeProduct/:id', protect, removeProduct)
router.patch('/updateProduct/:id',protect,updateProduct)
module.exports = router
