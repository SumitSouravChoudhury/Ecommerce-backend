const Product = require("../models/product");

const handleAddProduct = async (req, res, next) => {
  const {
    productName,
    productDescription,
    productPrice,
    productRating,
    productQuantity,
    productType,
    productBrand,
    isAvailable,
  } = req.body;

  if (!productName)
    return res
      .status(400)
      .json({ success: false, message: "Product Name is required" });
  if (!productDescription)
    return res
      .status(400)
      .json({ success: false, message: "Product Description is required" });
  if (!productPrice)
    return res
      .status(400)
      .json({ success: false, message: "Product Price is required" });
  if (!productBrand)
    return res
      .status(400)
      .json({ success: false, message: "Product Brand is required" });
  if (productRating !== undefined && (productRating < 0 || productRating > 5))
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 0 and 5" });
  if (!productQuantity)
    return res
      .status(400)
      .json({ success: false, message: "Product Quantity is required" });

  try {
    const product = await Product.create({
      productName,
      productDescription,
      productPrice,
      productRating,
      productQuantity,
      productType,
      productBrand,
      isAvailable,
      user: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetAllProducts = async (req, res, next) => {
  const { search } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (search) {
    filter.$or = [
      { productName: { $regex: search, $options: "i" } },
      { productDescription: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const [allProducts, total] = await Promise.all([
      Product.find(filter)
        .populate("user", "-password")
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      products: allProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProductById = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate(
      "user",
      "-password",
    );

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product id not found" });

    return res.status(200).json({ success: true, product: product });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProductById = async (req, res, next) => {
  const { productId } = req.params;

  const {
    productName,
    productDescription,
    productPrice,
    productRating,
    productQuantity,
    productType,
    productBrand,
    isAvailable,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productRating ||
    !productQuantity ||
    !productType ||
    !productBrand ||
    !isAvailable
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Atleast one field is required" });
  }

  try {
    const updates = {};
    if (productName) updates.productName = productName;
    if (productDescription) updates.productDescription = productDescription;
    if (productPrice) updates.productPrice = productPrice;
    if (productRating) updates.productRating = productRating;
    if (productQuantity) updates.productQuantity = productQuantity;
    if (productType) updates.productType = productType;
    if (productBrand) updates.productBrand = productBrand;
    if (isAvailable) updates.isAvailable = isAvailable;

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    }).select("-password");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product id not found" });

    return res
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    next(error);
  }
};

const handleDeleteProductById = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product id not found" });

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetAllProducts,
  handleAddProduct,
  handleGetProductById,
  handleUpdateProductById,
  handleDeleteProductById,
};
