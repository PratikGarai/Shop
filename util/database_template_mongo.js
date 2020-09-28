const mongodb  = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
	const uri = "mongodb+srv://Pratik:<password>@pratikcluster.2hp8l.mongodb.net/<dbname>?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		const collection = client.db("test").collection("devices");
  		client.close();
	});	
	console.log("Connected");
	callback(client);
	return client;
}

module.exports = mongoConnect;
