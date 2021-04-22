const express = require("express");
const adminController  = require("../controllers/admin");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get('/products',isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product/:productId', isAuth, adminController.postEditProduct);
router.post('/delete-product/:productId', isAuth,adminController.postDeleteProduct);

module.exports = router;