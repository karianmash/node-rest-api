const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect(
  `mongodb+srv://karian:${process.env.MONGO_ATLAS_PW}@node-rest-shop.scf0b.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

// Middleware to log all incoming requests to the server
app.use(morgan("dev"));

app.use("/uploads", express.static("./uploads"));
// Parse incoming urlencoded and json bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handle CORs errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Handle requests that cross past the above request handlers
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status == 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
