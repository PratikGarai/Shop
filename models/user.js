const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User 
{
	constructor(username, email, cart, _id)
	{
		this.username = username;
		this._id = _id;
		this.email = email;
	}

	save()
	{
		const db= getDb();
		return db
			.collection('users')
			.insertOne(this)
			.then(result => {
				console.log("User added");
			})
			.catch(err => {
				console.log(err);
			});
	}

	addToCart(product)
	{
	//	 const cartProduct = this.cart.items.findIndex(cp =>{
	//	 	return cp._id === product._id;
	//	 });
		const updatedCart = {items : [{...product , quantity : 1}]};
		const db= getDb();
		return db
			.collection('users')
			.updateOne(
				{_id : new mongodb.ObjectID(this._id)},
				{$set : {cart : updatedCart}}
				);
	}

	static findById(userId)
	{
		const db = getDb();
		return db
			.collection('users')
			.findOne({ _id : new mongodb.ObjectId(userId)})
			.then( result => {
				return result;
			})
			.catch(err => {
				console.log("Error");
			});
	}
}

module.exports = User;
