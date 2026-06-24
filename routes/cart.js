const { Router } = require("express");

const { handleAddToCart, handleGetCart } = require("../controllers/cart");

const router = Router();

router.post("/addToCart", handleAddToCart);

router.get("/", handleGetCart);

module.exports = router;
