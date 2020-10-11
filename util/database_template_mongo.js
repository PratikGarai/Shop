const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<user>:<password>@<cluster URI>/<dbname>?retryWrites=true&w=majority";

let _db;

const connection = (callback) => {
	MongoClient.connect(uri, { useNewUrlParser: true })
	.then(client => {
		console.log("Success");
		console.log(client);
		_db = client.db();
		callback();
	})
	.catch(err => {
		console.log("Error");
		console.log(err);
		throw err;
	});
}

const getDb = ()=>{
	if(_db)
		return _db;
	else
		throw 'No database found';
}

exports.mongoConnect = connection;
exports.getDb = getDb;
