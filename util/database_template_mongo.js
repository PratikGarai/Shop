const mongodb  = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db ;

const mongoConnect = callback => {
	const uri = "mongodb+srv://Pratik:<password>@pratikcluster.2hp8l.mongodb.net/<dbname>?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		const collection = client.db("test").collection("devices");
  		client.close();
		throw err;
	});	
	console.log("Connected");
	_db = client.db();
	callback(client);
	return client;
}

const getDb = () => {
	if(_db)
	{
		return (_db);
	}
	throw "No database found";
}

exports.mongoConnect = mongoConnect;    //responsible to store the connection
exports.getDb = getDb; 			//responsible to give access to the db
