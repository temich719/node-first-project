const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");

router.put("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }

  try {
    const updatedUser = User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedUser);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    resp.status(200).json("User with id = " + req.params.id + " was deleted!");
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/find/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    resp.status(200).json(others);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, (req, resp) => {
  const query = req.query.new;
  try {
    const users = query ? User.find().sort({ _id: -1 }).limit(5) : User.find();
    resp.status(200).json(users);
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.get("/getStats", verifyTokenAndAdmin, (req, resp) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    resp.status(200).json(data);
  } catch (err) {
    resp.status(500).json(err);
  }
});

module.exports = router;
