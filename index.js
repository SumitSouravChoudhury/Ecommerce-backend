require("./config/env");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("error: ", err));

app.listen(process.env.PORT, () =>
  console.log(`Server started at port: ${process.env.PORT}`),
);
