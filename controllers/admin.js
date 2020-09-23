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
	product
		.save()
		.then(()=> {
			res.redirect("/admin/products");
		})
		.catch((err)=> console.log(err));
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
	res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) =>{
	const prodID = req.params.productId;
	Product.delete_product(prodID);
	res.redirect("/admin/products");
};

exports.getProducts = (req, res, next)=> {
	Product
		.fetchAll()
		.then( ([rows, fieldData])=> {
			res.render('admin/products', {
				pageTitle : "Admin Products",
				prods : rows,
				path : '/admin/products'
			});
		})
		.catch(err => console.log(err));
};
