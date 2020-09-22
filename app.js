const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require("path");
const globalController = require('./controllers/globalPages');
const db = require('./util/database');

const app = express();

db.execute("SELECT * FROM products")
	.then( result =>{
		console.log(result);
	})
	.catch( err=>{
		console.log(err);
	});

app.set( "view engine" , "ejs");
app.set( "views" , "views" );

app.use(bodyParser.urlencoded({ 'extended' : false}));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(express.static( path.join(__dirname,'public') ));

app.use('/', globalController.get404 );
app.listen(3000);
