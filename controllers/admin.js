const Product  = require('../models/product');

exports.getAddProduct = (req, res, next)=> {
	res.render('admin/add-product', {
		pageTitle : 'Add Product',
		path : '/admin/add-product',
		editing : false,
		});
};

exports.postAddProduct = (req, res, next)=> {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	req.user
		.createProduct({
		title : title,
		price : price,
		imageUrl : imageUrl,
		description : description
		})
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
	req.user
		.getProducts( { where : {id : prodID} } )
		.then( product => {
			res.render('admin/add-product', {
				pageTitle : 'Edit Product',
				path : '/admin/edit-product',
				editing : true,
				product : product[0]
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
		.findByPk(id)
		.then(product => {
			product.title = title;
			product.imageUrl = imageUrl;
			product.price = price;
			product.description = description;
			return product.save();
		})
		.then( result => {
			console.log("Updated Product successfully");
			console.log(result);
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
		.findByPk(prodID)
		.then( product => product.destroy() )
		.then( result => {
			console.log("Product deleted");
			res.redirect("/admin/products");
		})
		.catch( err => {
			console.log("Error while fetching");
			console.log("Error");
			res.redirect("/admin/products");
		});
};

exports.getProducts = (req, res, next)=> {
	req.user
		.getProducts()
		.then( products=> {
			res.render('admin/products', {
				pageTitle : "Admin Products",
				prods : products,
				path : '/admin/products'
			});
		})
		.catch(err => console.log(err));
};
