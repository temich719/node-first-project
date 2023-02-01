const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../models/Product");

router.post("/", verifyTokenAndAdmin, async (req, resp) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = newProduct.save();
    resp.status(200).json(savedProduct);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    resp.status(200).json(updatedProduct);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    resp
      .status(200)
      .json("Product with id = " + req.params.id + " was deleted");
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/find/:id", async (req, resp) => {
  try {
    const product = await Product.findById(req.params.id);
    resp.status(200).json(product);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/", async (req, resp) => {
  const qNew = req.query.new;
  const qCategories = req.query.categories;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategories) {
      products = await Product.find({
        categories: { $in: qCategories },
      });
    } else {
      products = await Product.find();
    }
    resp.status(200).json(products);
  } catch (err) {
    resp.status(500).json(err);
  }
});

module.exports = router;
