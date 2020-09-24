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
	Cart.getCart(cart => {
		Product.fetchAll(products => {
			const cartProducts = [];
			for(product of products){
				const cartProductData = cart.products.find(prod => prod.id==product.id); 
				if(cartProductData){
					cartProducts.push({
						productData : product,
						qty : cartProductData.qty
					});
				}
			}
			console.log(cart.totalPrice);
			res.render('shop/cart', {
				pageTitle : "Your Cart", 
				path : '/cart',
				products : cartProducts
			});
		});
	});
};

exports.postCart = (req, res, next)=>{
	const prodId = req.body.productId;
	Product.getById(prodId, (product)=> {
		Cart.addProduct(prodId, product.price);
	});
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
