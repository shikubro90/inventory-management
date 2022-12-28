const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      require: [true, "Please add a name"],
      trim: true,
    },
    sku: {
      type: String,
      require: true,
      default: "SKU",
      trim: true,
    },
    category: {
      type: String,
      require: [true, "Please add a category"],
      trim: true,
    },
    quantity: {
      type: String,
      require: [true, "Please add a quantity"],
      trim: true,
    },
    price: {
      type: String,
      require: [true, "Please add a price"],
      trim: true,
    },
    description: {
      type: String,
      require: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: Object,
      require: [true, "Please add a photo"],
      default: "https://www.fiverr.com/users/tech_wise1/seller_dashboard",
    },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Products", productSchema);
module.exports = Product;
