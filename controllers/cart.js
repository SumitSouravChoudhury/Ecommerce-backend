const Cart = require("../models/cart");
const Product = require("../models/product");

const handleAddToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const user = req.user._id;

  if (!productId)
    return res
      .status(400)
      .json({ success: false, message: "Product id is required" });

  if (quantity < 1)
    return res
      .status(400)
      .json({ success: false, message: "Quantity must be at least 1" });

  try {
    const product = await Product.findById(productId);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (!product.isAvailable || product.productQuantity < quantity)
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock" });

    let cart = await Cart.findOne({ user, status: "active" });

    if (!cart) {
      cart = await Cart.create({
        user,
        items: [{ productId, quantity, price: product.productPrice }],
      });

      return res.status(201).json({
        success: true,
        message: "Cart created and product added",
        cart,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      if (product.productQuantity < existingItem.quantity + quantity)
        return res
          .status(400)
          .json({ success: false, message: "Insufficient stock" });

      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.productPrice });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "user",
      "-password",
    );

    if (cart.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    return res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAddToCart, handleGetCart };
