const mongoose = require("mongoose");
const Product = require("../models/products");

exports.get_all_products = (req, res, next) => {
  Product.find()
    // select specific properties
    .select("name price _id productImage")
    // The exec() method turns query result to a true promise.
    .exec()
    .then((docs) => {
      // Structure the response
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            productImage: doc.productImage,
            price: doc.price,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${doc._id}`,
            },
          };
        }),
      };

      if (docs.length >= 1) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully!",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_single_product = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From database" + doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for the provided id!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.update_product = (req, res, next) => {
  const productId = req.params.productId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.updateOne({ _id: productId }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${productId}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_product = (req, res, next) => {
  const productId = req.params.productId;
  Product.remove({ _id: productId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          data: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
