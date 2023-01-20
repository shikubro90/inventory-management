const asyncHandler = require('express-async-handler')
const Product = require('../modles/product')

// Create products

const createProducts = asyncHandler(async (req, res) => {
  const { name, sku, category, price, quantity, description } = req.body
  // validation
  if (name || category || quantity || price || description) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  // Handle image upload
  let fileData = {}
  if (req.file) {
    fileData = {
      fileName: req.file.originalname,
      filePath: req.file.filePath,
      fileType: req.file.fileType,
      fileSize: req.file.fileSize,
    }
  }

  // create product 
  const product = await Product.create({
    user : req.user.id,
    name,
    sku, 
    category,
    quantity,
    price,
    description,
    image : fileData,
  });

  res.status(200).json(product)

})


module.exports = {createProducts}
