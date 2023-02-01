const express = require("express");

const app = express();
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/product");
const stripeRouter = require("./routes/stripe");
const cors = require("cors");

dotenv.config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Successfully connected to MongoDb!"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/api/checkout", stripeRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", productRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log("Backend server is running");
});
