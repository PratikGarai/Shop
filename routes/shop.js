const express = require("express");
const path = require("path");
const adminData = require('./admin.js');
const productController = require("../controllers/products"); 

const router = express.Router();

router.get('/', productController.getProducts);

module.exports = router;
