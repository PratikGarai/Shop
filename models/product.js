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
		return db.execute("INSERT INTO products (title, imageUrl, description, price) VALUES (?,?,?,?)",
			[ this.title, this.imageUrl, this.description, +this.price ]);
  	}

	static delete_product(id){
	}

  	static fetchAll() {
		return db.execute("SELECT * FROM products");
  	}

	static getById(id) {
		return db.execute("SELECT * FROM products WHERE products.id = ?",[id]);
	}
};
