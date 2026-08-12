const express = require("express");
const router = express.Router();

const {cart, getCart} = require("../controllers/Cart");
const {auth} = require("../middlewares/auth")

router.post("/addToCart", auth, cart);
router.get("/getCart", auth, getCart)

module.exports = router;