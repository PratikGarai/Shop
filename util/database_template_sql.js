const mysql = require('mysql2');

const connection = mysql.createPool({
	host : 'localhost',
	user : 'root',
	database : 'shop-app-node',
	password : '***********'   // some password here
});

module.exports = connection.promise();
