const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, resp) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });
  try {
    await newUser.save();
    resp.status(201).json("User has been saved!");
  } catch (err) {
    resp.status(500).json(err);
  }
});

router.post("/login", async (req, resp) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && resp.status(401).json("Wrong credentials");
    const hashedPassword = user.password;
    const originalPassword = CryptoJS.AES.decrypt(
      hashedPassword,
      process.env.PASSWORD_SECRET
    ).toString(CryptoJS.enc.Utf8);
    originalPassword != req.body.password &&
      resp.status(401).json("Wrong password");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    resp.status(200).json({ ...others, accessToken });
  } catch (err) {
    resp.status(401).json("Wrong creadentials");
  }
});

module.exports = router;
