const express = require("express");
const adminController  = require("../controllers/admin");
const isAuth = require("../middlewares/isAuth");
const {body} = require("express-validator/check");

const router = express.Router();

router.get('/products',isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
    '/add-product',
    [
        body('title', "Title should be atleast 3 characters long")
            .isString()
            .isLength({min : 3})
            .trim(),
        body('price', "Price not a valid float value")
            .isFloat(),
        body('description', "Description should be 5-400 characters long")
            .isLength({min : 5, max:400})
            .trim()
    ],
    isAuth, 
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product/:productId', 
    [
        body('title', "Title should be atleast 3 characters long")
            .isString()
            .isLength({min : 3})
            .trim(),
        body('price', "Price not a valid float value")
            .isFloat(),
        body('description', "Description should be 5-400 characters long")
            .isLength({min : 5, max:400})
            .trim()
    ],
    isAuth, 
    adminController.postEditProduct);

router.post('/delete-product/:productId', isAuth,adminController.postDeleteProduct);

module.exports = router;