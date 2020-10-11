const getDb = require('../util/database').getDb;

class Product
{
	constructor(title, price, description, imageUrl)
	{
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	save()
	{
		const db = getDb();
		return db
			.collection('products')
			.insertOne(this)
			.then()
			.catch(err => {
				console.log(err);
			});
	}

	static fetchAll()
	{
		const db = getDb();
		return db
			.collection('products')
			.find()
			.toArray()
			.then( products => {
				return products;
			})
			.catch( err => {
				console.log(err);
			});
	}
}

module.exports = Product;
