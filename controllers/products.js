const asyncHandler = require('express-async-handler')
const Product = require('../modles/product')

// Create products
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, price, quantity, description } = req.body
  // validation
  if (!name || !category || !quantity || !price || !description) {
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


// getProducts

const getProducts = asyncHandler(async (req,res)=>{
    const products = await Product.find({user: req.user.id}).sort("-createdAt");
    res.status(200).json(products)
})







module.exports = {createProduct,getProducts}
