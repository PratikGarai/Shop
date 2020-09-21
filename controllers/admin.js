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
	const product = new Product(title, imageUrl, description, price);
	product.save();
	res.redirect("/");
};

exports.getEditProduct = (req, res, next)=> {
	const prodID = req.params.productId;
	Product.getById(prodID, product=>
	{
		if(!product)
		{
			res.redirect('/');
		}
		else
		{
			res.render('admin/add-product', {
				pageTitle : 'Edit Product',
				path : '/admin/edit-product',
				editing : true,
				product : product
				});
		}
	});
};

exports.postEditProduct = (req, res, next)=> {
	const id = req.params.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(title, imageUrl, description, price);
	product.save(id);
	res.redirect("/");
};

exports.postDeleteProduct = (req, res, next) =>{
	const prodID = req.params.productId;
	Product.delete_product(prodID);
	res.redirect("/");
};

exports.getProducts = (req, res, next)=> {
	Product.fetchAll( products => {
	res.render('admin/products', {
		pageTitle : "Admin Products", 
		prods : products,
		path : '/admin/products'
		});
	});
};
