const mysql = require('mysql2');

const connection = mysql2.createPool({
	host : 'localhost',
	user : 'root',
	database : 'shop-app-node',
	password : '***********'   // some password here
});
