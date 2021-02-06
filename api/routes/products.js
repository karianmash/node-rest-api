const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");

const ProductsController = require("../controllers/products");

// The disk storage engine gives you full control on storing files to disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

// Filter to accept only certain types of images

// const fileFilter = (req, file, cb) => {
//   // Reject a file
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cd(null, false);
//   }
// };

// Limits the size of the images uploaded
const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
  // fileFilter
});

router.get("/", ProductsController.get_all_products);

router.post("/", checkAuth,  upload.single("productImage"), ProductsController.create_product);

router.get("/:productId", ProductsController.get_single_product);

router.patch("/:productId", checkAuth, ProductsController.update_product);

router.delete("/:productId", checkAuth, ProductsController.delete_product);

module.exports = router;
