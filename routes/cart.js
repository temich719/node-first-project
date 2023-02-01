const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Cart = require("../models/Cart");

router.post("/", verifyToken, async (req, resp) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    resp.status(200).json(savedCart);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedCart);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    resp
      .status(200)
      .json("Cart with id = " + req.params.id + " has been deleted");
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    const cart = await Cart.find({
      userId: req.params.userId,
    });
    resp.status(200).json(cart);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, resp) => {
  try {
    const carts = await Cart.find();
    resp.status(200).json(carts);
  } catch (err) {
    resp.status(500).json(err);
  }
});

module.exports = router;
