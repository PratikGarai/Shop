const Product  = require('../models/product');

exports.getProducts = (req, res, next)=> {
	Product.fetchAll( products => {
	res.render('shop/product-list', {
		pageTitle : "Shop", 
		prods : products,
		path : '/products'
		});
	});
};

exports.getIndex = (req, res, next)=>{
	Product.fetchAll( products => {
	res.render('shop/index', {
		pageTitle : "Our Products", 
		prods : products,
		path : '/'
		});
	});
};

exports.getCart = (req, res, next)=>{
	Product.fetchAll( products => {
	res.render('shop/cart', {
		pageTitle : "Your Cart", 
		path : '/cart'
		});
	});
};

exports.getCheckout = (req, res, next)=>{
	Product.fetchAll( products => {
	res.render('shop/checkout', {
		pageTitle : "$$ Checkout $$", 
		path : '/checkout'
		});
	});
};

