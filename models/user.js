const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User 
{
	constructor(username, email, cart, _id)
	{
		this.username = username;
		this._id = _id;
		this.email = email;
		this.cart = cart;
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

	addToCart(product)
	{
		const cartProductIndex = this.cart.items.findIndex(cp =>{
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		if(cartProductIndex >= 0)
		{
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		}
		else
		{
			updatedCartItems.push({
				productId : new mongodb.ObjectID(product._id) , 
				quantity : 1
			});
		}
		const updatedCart = {
			items : updatedCartItems
		};
		const db= getDb();
		return db
			.collection('users')
			.updateOne(
				{_id : new mongodb.ObjectID(this._id)},
				{$set : {cart : updatedCart}}
				);
	}

	getCart()
	{
		const db = getDb();
		const productIds = this.cart.items.map( i => {
			return i.productId;
		});
		return db
				.collection('products')
				.find({_id : {$in : productIds}})
				.toArray()
				.then(products => {
					return products.map( p=> {
						return { ...p, quantity : this.cart.items.find( i=> 
							{
								return i.productId.toString() === p._id.toString();
							}).quantity
						};
					})
				})
				.catch(err => {
					console.log(err);
				});
	}

	deleteItemFromCart(productId)
	{
		const updatedCartItems = this.cart.items.filter( item => {
			return item.productId.toString() !== productId.toString();
		});
		const db= getDb();
		return db
			.collection('users')
			.updateOne(
				{_id : new mongodb.ObjectID(this._id)},
				{$set : {cart : { items : updatedCartItems }}}
				);
	}

	addOrder()
	{
		const db = getDb();
		return db
		  .collection('orders')
		  .insertOne(this.cart)
		  .then(result => {
			  this.cart = {items : []};
			  return db
			    .collection('users')
			    .updateOne(
				  {_id : new mongodb.ObjectID(this._id)},
				  {$set : {cart : {items : [] }}}
				  );
		  });
	}
}

module.exports = User;
