const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User 
{
	constructor()
	{
		this.username = username;
		this._id = _id;
		this.email = email
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
}

module.exports = User;
