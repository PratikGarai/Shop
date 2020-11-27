const Product  = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/Order');

exports.getProducts = (req, res, next)=> {
	Product
		.fetchAll()
		.then(products=> {
			res.render('shop/product-list', {
				pageTitle : "Shop", 
				prods : products,
				path : '/products'
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next)=> {
	const prodId = req.params.productId;
	Product
		.findById(prodId)
		.then(product=>{
			res.render('shop/product-detail',{
				pageTitle : product.title+" : Details",
				product : product,
				path : '/products'
			});
		})
		.catch((err) => console.log(err));
};

exports.getIndex = (req, res, next)=>{
	Product
		.fetchAll()
		.then(products=> {
			res.render('shop/product-list', {
				pageTitle : "Shop", 
				prods : products,
				path : '/'
			});
		})
		.catch(err => console.log(err));
};

exports.getCart = (req, res, next)=>{
	req.user
		.getCart()
 		.then(cartProducts => {
 			res.render('shop/cart', {
 				pageTitle : "Your Cart", 
 				path : '/cart',
 				products : cartProducts
 			});
 		})
 		.catch(err => console.log(err));
};

 exports.postCart = (req, res, next)=>{
	 const prodId = req.body.productId;
	 const product = Product
						 .findById(prodId)
						 .then(product => {
							 return req.user.addToCart(product);
						 })
						 .then(result => {
							 console.log(result);
							 res.redirect('/cart');
						 })
						 .catch(error => {
							 console.log(error);
						 });
};

exports.postDeleteFromCart = (req, res, next) =>{
	const prodId = req.params.productId;
	req.user
		.deleteItemFromCart(prodId)
		.then(result => {
 			res.redirect('/cart');
 		})
 		.catch(err => console.log(err));
};

exports.postOrder = (req, res, next)=>{
	req.user
		.addOrder()
 		.then(result => {
 			res.redirect('/orders');
 		})
 		.catch(err => {
			 console.log(err)
		});
};

// exports.getOrders = (req, res, next)=>{
// 	req.user
// 		.getOrders({include : ['products']})
// 		.then(orders => {
// 			res.render('shop/orders', {
// 				pageTitle : "Your Orders", 
// 				path : '/orders',
// 				orders : orders
// 			});
// 		})
// 		.catch(err=> console.log(err));
// };

// exports.getCheckout = (req, res, next)=>{
// 	Product.fetchAll( products => {
// 	res.render('shop/checkout', {
// 		pageTitle : "$$ Checkout $$", 
// 		path : '/checkout'
// 		});
// 	});
// };
