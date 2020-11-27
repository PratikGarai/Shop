const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose  = require("mongoose");

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

const globalController = require('./controllers/globalPages');

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
			req.user = new User(user.username, user.email, user.cart, user._id);
			next();
		})
		.catch(err => {
			console.log(err)
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', globalController.get404 );

mongoose.connect("mongodb+srv://pratik:pratik@cluster0.cflq7.gcp.mongodb.net/shop?retryWrites=true&w=majority")
		.then( res => {
			console.log("Starting server");
			app.listen(3000);
		})
		.catch(err => {
			console.log(err);			
		});