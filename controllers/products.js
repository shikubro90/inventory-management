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
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  })

  res.status(200).json(product)
})

// getProducts

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort('-createdAt')
  res.status(200).json(products)
})

// getProducts by ID
const getProduct = asyncHandler(async (req, res) => {
  const products = await Product.findById(req.params.id)

  if (!products) {
    res.status(404)
    throw new Error('Products not found')
  }
  if (products.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  res.status(200).json(products)
})

// removeProduct
const removeProduct = asyncHandler(async (req, res) => {
  const getProduct = await Product.findById(req.params.id)
  if (!getProduct) {
    res.status(401)
    throw new Error('Products not found')
  }
  if (getProduct.user.toString() !== req.user.id) {
    res.status(404)
    throw new Error('User not authorized')
  }
  await getProduct.remove()
  res.status(200).json({
    message: 'Product remove successfully',
  })
})

// updateProduct

const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body
  const { id } = req.params
  const product = await Product.findById(id)

  // if products doesn't
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (product.user.toString() !== req.user.id) {
    res.status(404)
    throw new Error('User not authorized')
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

  const updatedProducts = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedProducts)
})

module.exports = { createProduct, getProducts, getProduct, removeProduct, updateProduct }
