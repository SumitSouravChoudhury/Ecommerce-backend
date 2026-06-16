const { Router } = require("express");

const { handleUserSignup, handleUserLogin } = require("../controllers/auth");

const router = Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;
