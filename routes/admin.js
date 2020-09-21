const express = require("express");
const path = require("path");
const adminController  = require("../controllers/admin");

const router = express.Router();

router.get('/add-product',adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/edit-product/:productId',adminController.getEditProduct);
router.post('/edit-product/:productId',adminController.postEditProduct);
router.get('/products', adminController.getProducts);

module.exports = router;
