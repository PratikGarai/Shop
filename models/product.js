const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  	path.dirname(process.mainModule.filename),
  	'data',
  	'products.json'
);

const getProductsFromFile = cb => {
  	fs.readFile(p, (err, fileContent) => {
    	if (err || fileContent=="") {
      		cb([]);
    	} 
	else {
      		cb(JSON.parse(fileContent));
    	}
	});
};

module.exports = class Product {
  	constructor(title, imageUrl, description, price) {
    		this.title = title;
    		this.imageUrl = imageUrl;
    		this.description = description;
    		this.price = price;
  	}

	save(id) {
    		getProductsFromFile(products => {
		if(id){
			this.id = id;
			const productIndex =  products.findIndex(p => p.id == this.id);
			products[productIndex] = this;
		}
		else{
			this.id = Math.random();
      			products.push(this);
		}
      		fs.writeFile(p, JSON.stringify(products), err => {
			if(!err){
        			console.log(err);
			}
      			});
    		});
  	}

	static delete_product(id){
		getProductsFromFile(products => {
		const productIndex =  products.findIndex(p => p.id == id);
		const product = products[productIndex];

		let i;
		const newProducts = [];
		for(i=0;i<products.length;i++)
		{
			if(i!=productIndex)
			{
				newProducts.push(products[i]);
			}
		}

		Cart.deleteProduct(id, product.price);
      		fs.writeFile(p, JSON.stringify(newProducts), err => {
			if(!err){
        		console.log(err);
			}
      			});
    		});

	}

  	static fetchAll(cb) {
    		getProductsFromFile(cb);
  	}

	static getById(ID,cb) {
		getProductsFromFile(products => {
			const product =  products.find(p => p.id == ID);
			cb(product);
		});
	}
};
