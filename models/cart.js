const fs = require('fs');
const path = require('path');

const p = path.join(
  	path.dirname(process.mainModule.filename),
  	'data',
  	'cart.json'
);

// In the cart, products will be stored as { id: , quantity: } pairs
module.exports = class Cart{
	static addProduct(id, productPrice){
		//Workflow :
		//Fetch the previous cart
		fs.readFile(p, (err, fileContent)=> {
			let cart = { products:[], totalPrice:0 };
			if(!err){
				cart = JSON.parse(fileContent);	
			}

			//Analyse the presence
			const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			//Add new product/ increase the quantity
			if(existingProduct){
				updatedProduct = { ...existingProduct };
				updatedProduct.qty = updatedProduct.qty+1;
				cart.products[existingProductIndex] = updatedProduct;

			}
			else{
				updatedProduct = { id : id, qty : 1 };
				cart.products.push(updatedProduct);
			}
			cart.totalPrice = cart.totalPrice + +productPrice;
			fs.writeFile(p, JSON.stringify(cart), (err)=>{
				console.log(err);
				console.log(cart.totalPrice);
			});
		});
	}
}
