const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
      },
    ],
    couponCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "abandoned", "checked_out"],
      default: "active",
    },
  },
  { timestamps: true },
);

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
