const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
    },
    productBrand: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
