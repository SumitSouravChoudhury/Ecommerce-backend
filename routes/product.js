const { Router } = require("express");

const {
  handleGetAllProducts,
  handleAddProduct,
  handleGetProductById,
  handleUpdateProductById,
  handleDeleteProductById,
} = require("../controllers/product");

const { accessTo } = require("../middlewares/accessTo");

const router = Router();

router
  .route("/")
  .get(handleGetAllProducts)
  .post(accessTo("admin"), handleAddProduct);

router
  .route("/:productId")
  .get(accessTo("admin"), handleGetProductById)
  .patch(accessTo("admin"), handleUpdateProductById)
  .delete(accessTo("admin"), handleDeleteProductById);

module.exports = router;
