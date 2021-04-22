const Product  = require('../models/product');
const Order = require('../models/order');
const user = require('../models/user');

exports.getProducts = (req, res, next)=>{
	Product
		.find()
		.then(products=> {
			res.render('shop/product-list', {
				pageTitle : "Products", 
				prods : products,
				path : '/products'
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next)=>{
	const prodId = req.params.productId;
	// console.log("Params :", req.params);
	Product
		.findById(prodId)
		.then(product=>{
			// console.log("Product ",product);
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
		.find()
		.then(products=> {
			res.render('shop/index', {
				pageTitle : "Shop", 
				prods : products,
				path : '/'
			});
		})
		.catch(err => console.log(err));
};

exports.getCart = (req, res, next)=>{
	req.user
		.populate('cart.items.productId')
		.execPopulate()
 		.then(result => {
			const products = req.user.cart.items;
 			res.render('shop/cart', {
 				pageTitle : "Your Cart", 
 				path : '/cart',
 				products : products
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
							//  console.log(result);
							 res.redirect('/cart');
						 })
						 .catch(error => {
							 console.log(error);
						 });
};

exports.postDeleteFromCart = (req, res, next)=>{
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
		.populate('cart.items.productId')
		.execPopulate()
 		.then(result => {
			const products = req.user.cart.items.map(i=>{
				return {quantity : i.quantity, productData : { ...i.productId._doc }}
			});
			const order = new Order({
				user : {
					email : req.user.email,
					userId : req.user
				},
				products : products
			});

			order
			  .save()
			  .then( result => {
				  req.user.clearCart()
					.then(result =>{
						res.redirect('/orders');
					})
			  })
			  .catch(err =>{
				  console.log(err);
			  });
		 })
		 .catch(err => {
			 console.log(err);
		 });
};

exports.getOrders = (req, res, next)=>{
	Order.find({"user.userId": req.user._id})
		.then(orders => {
 			res.render('shop/orders', {
 				pageTitle : "Your Orders", 
 				path : '/orders',
 				orders : orders
 			});
 		})
 		.catch(err=> console.log(err));
};

// exports.getCheckout = (req, res, next)=>{
// 	Product.fetchAll( products => {
// 	res.render('shop/checkout', {
// 		pageTitle : "$$ Checkout $$", 
// 		path : '/checkout'
// 		});
// 	});
// };
