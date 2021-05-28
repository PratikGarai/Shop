const mongodb = require('mongodb');
const Product  = require('../models/product');
const {validationResult} = require('express-validator/check');

exports.getAddProduct = (req, res, next)=> {
	res.render('admin/add-product', {
		pageTitle : 'Add Product',
		path : '/admin/add-product',
		editing : false,
		isLoggedIn : req.session.isLoggedIn,
		hasError : false,
		errorMessage : null,
		validationErrors : [],
	});
};

exports.postAddProduct = (req, res, next)=> {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;

	const image = req.file;
	if(!image) {
		return res.render('admin/add-product', {
			pageTitle : 'Add Product',
			path : '/admin/add-product',
			editing : false,
			isLoggedIn : req.session.isLoggedIn,
			hasError : true, 
			product : {
				title : title, 
				price : price, 
				description : description
			}, 
			errorMessage : "Attached file is not an image",
			validationErrors: [],
		});
	}

	const errors = validationResult(req);
	if(!errors.isEmpty())
	{
		return res.render('admin/add-product', {
			pageTitle : 'Add Product',
			path : '/admin/add-product',
			editing : false,
			isLoggedIn : req.session.isLoggedIn,
			hasError : true, 
			product : {
				title : title, 
				price : price, 
				description : description
			}, 
			errorMessage : errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	const product = new Product({
		title : title, 
		price : price, 
		description : description, 
		imageUrl : image.path,
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
			if(product.userId.toString() !== req.user._id.toString())
			{
				return res.redirect('/');
			}
			res.render('admin/add-product', {
				pageTitle : 'Edit Product',
				path : '/admin/add-product',
				editing : true,
				product : product,
				hasError : false,
				errorMessage : null,
				validationErrors: [],
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
	const price = req.body.price;
	const description = req.body.description;
	const image = req.file;

	const errors = validationResult(req);
	if(!errors.isEmpty())
	{
		return res.render('admin/add-product', {
			pageTitle : 'Edit Product',
			path : '/admin/add-product',
			editing : true,
			isLoggedIn : req.session.isLoggedIn,
			hasError : true, 
			product : {
				title : title, 
				price : price, 
				description : description,
				_id : id,
			}, 
			errorMessage : errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}
	
	Product
		.findById(id)
		.then(product => {
			if(product.userId.toString() !== req.user._id.toString())
			{
				return res.redirect('/');
			}
			product.title = title;
			product.price = price;

			if(image)
				product.imageUrl = image.path;
			product.description = description;
			return product
			.save()
			.then( result => {
				console.log("Updated Product successfully");
				res.redirect("/admin/products");
			})
			.catch( err => {
				console.log("Error while updating : ", err);
				res.redirect("/admin/products");
			})
		});
};

exports.postDeleteProduct = (req, res, next) =>{
	const prodID = req.params.productId;
	Product
		.findById(prodID)
		.then(product => {
			if(product.userId.toString() !== req.user._id.toString())
			{
				return res.redirect('/');
			}
		})
		.catch(err => {
			console.log("Error fetching product");
			res.redirect('/');
		});

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
		.find({userId : req.user._id})
		.then( products=> {
			res.render('admin/products', {
				pageTitle : "Admin Products",
				prods : products,
				path : '/admin/products',
			});
		})
		.catch(err => console.log(err));
};