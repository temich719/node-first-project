const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/Order");

router.post("/", verifyToken, async (req, resp) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    resp.status(200).json(savedOrder);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedOrder);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    resp
      .status(200)
      .json("Order with id = " + req.params.id + " has been deleted");
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    });
    resp.status(200).json(orders);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, resp) => {
  try {
    const orders = await Order.find();
    resp.status(200).json(orders);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/income", verifyTokenAndAdmin, async (req, resp) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { $gte: previousMonth } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    resp.status(200).json(income);
  } catch (err) {
    resp.status(500).json(err);
  }
});

module.exports = router;
