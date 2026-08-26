const express = require("express");
const router = express.Router();

const {cart, getCart} = require("../controllers/Cart");
const {auth} = require("../middlewares/auth");
const {removefromCart} = require("../controllers/Cart")

router.post("/addToCart", auth, cart);
router.get("/getCart", auth, getCart);
router.delete("/removefromCart", auth, removefromCart);

module.exports = router;