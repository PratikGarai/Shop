const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require("path");
const globalController = require('./controllers/globalPages');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set( "view engine" , "ejs");
app.set( "views" , "views" );

app.use(bodyParser.urlencoded({ 'extended' : false}));
app.use(express.static( path.join(__dirname,'public') ));

app.use((req, res, next)=>{
	User
		.findById('5f87a8463145b87e5821c38f')
		.then( user=> {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err)
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', globalController.get404 );

mongoConnect( () => {
		console.log("Starting Server");
		app.listen(3000);
	});
