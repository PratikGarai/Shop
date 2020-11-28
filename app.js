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
		.findById('5fc21c8d01c44b545c817bc0')
		.then( user=> {
			console.log(user);
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

mongoose.connect("mongodb+srv://pratik:pratik@cluster0.cflq7.gcp.mongodb.net/shop?retryWrites=true&w=majority")
		.then( res => {
			User
			  .findOne()
			  .then(user => {
				  if(!user)
				  {
					const user = new User({
					name : 'Pratik',
					email : 'hello@test.com',
					cart : {
						items : []
					}
					});
					user.save();
				  }
			  })
			console.log("Starting server");
			app.listen(3000);
		})
		.catch(err => {
			console.log(err);			
		});