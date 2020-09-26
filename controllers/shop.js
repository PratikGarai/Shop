const Cart = require('../models/cart');
const Product  = require('../models/product');

exports.getProducts = (req, res, next)=> {
	Product
		.findAll()
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
		.findByPk(prodId)
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
		.findAll()
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
		.then( cart => {
			return cart.getProducts();
		})
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
	let fetchedCart;
	req.user
		.getCart()
		.then( cart => {
			fetchedCart = cart;
			return cart.getProducts({where:{id : prodId}});
		})
		.then(products=>{
			let product;
			if(products.length>0)
				product = products[0];
			let newQuantity = 1;
			if(product)
				console.log('');
			return Product
				.findByPk(prodId)
				.then(product=> {
					return fetchedCart.addProduct(product, {
						through : {quantity : newQuantity}
					});
				})
				.catch(err => console.log(err))
		})
		.then( ()=> res.redirect('/cart') )
		.catch(err=> console.log(err));
	res.redirect('/cart');
};

exports.postDeleteFromCart = (req, res, next) =>{
	const prodId = req.params.productId;
	Product.getById(prodId, product=>{
		Cart.deleteProduct(product.id, product.price);
		res.redirect('/cart');
	});
};

exports.getOrders = (req, res, next)=>{
	Product.fetchAll( products => {
	res.render('shop/orders', {
		pageTitle : "Your Orders", 
		path : '/orders'
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
