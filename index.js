require("./config/env");

const express = require("express");
const mongoose = require("mongoose");

const { errorHandler } = require("./middlewares/errorHandler");
const { authenticate } = require("./middlewares/authenticate");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("error: ", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/user", authenticate, userRoute);
app.use("/api/product", authenticate, productRoute);
app.use("/api/cart", authenticate, cartRoute);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server started at port: ${process.env.PORT}`),
);
