const mongodb = require('mongodb');
const Product  = require('../models/product');

exports.getAddProduct = (req, res, next)=> {
	res.render('admin/add-product', {
		pageTitle : 'Add Product',
		path : '/admin/add-product',
		editing : false,
		isLoggedIn : req.session.isLoggedIn,
		});
};

exports.postAddProduct = (req, res, next)=> {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product({
		title : title, 
		price : price, 
		description : description, 
		imageUrl : imageUrl,
		userId : req.user
	});
	product
		.save()
		.then( result => {
			console.log("Product added to database");
			res.redirect("/admin/products");
		})
		.catch(err => {
			console.log(err)
		});
	
};

exports.getEditProduct = (req, res, next)=> {
	const prodID = req.params.productId;
	Product
		.findById(prodID)
		.then( product => {
			res.render('admin/add-product', {
				pageTitle : 'Edit Product',
				path : '/admin/edit-product',
				editing : true,
				product : product,
				isLoggedIn : req.session.isLoggedIn,
			});
		})
		.catch ( err => {
			console.log("Error : ");
			console.log(err);
			res.redirect('/');
		});
};

exports.postEditProduct = (req, res, next)=> {
	const id = req.params.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	
	Product
		.findById(id)
		.then(product => {
			product.title = title;
			product.price = price;
			product.imageUrl = imageUrl;
			product.description = description;
			return product.save();
		})
		.then( result => {
			console.log("Updated Product successfully");
			res.redirect("/admin/products");
		})
		.catch( err => {
			console.log("Error while fetching");
			console.log("Error");
			res.redirect("/admin/products");
		});
};

exports.postDeleteProduct = (req, res, next) =>{
	const prodID = req.params.productId;
	Product
		.findByIdAndRemove(prodID)
		.then( result => {
			console.log("Deleted Product");
			res.redirect("/admin/products");
		})
		.catch( err => {
			res.redirect("/admin/products");
		});
};

exports.getProducts = (req, res, next)=> {
	Product
		.find()
		.then( products=> {
			res.render('admin/products', {
				pageTitle : "Admin Products",
				prods : products,
				path : '/admin/products',
				isLoggedIn : req.session.isLoggedIn,
			});
		})
		.catch(err => console.log(err));
};