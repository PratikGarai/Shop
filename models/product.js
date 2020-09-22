const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  	constructor(title, imageUrl, description, price) {
    		this.title = title;
    		this.imageUrl = imageUrl;
    		this.description = description;
    		this.price = price;
  	}

	save(id) {
  	}

	static delete_product(id){
	}

  	static fetchAll() {
		return db.execute("SELECT * FROM products");
  	}

	static getById(id) {
	}
};
