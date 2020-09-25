const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require("path");
const globalController = require('./controllers/globalPages');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set( "view engine" , "ejs");
app.set( "views" , "views" );

app.use(bodyParser.urlencoded({ 'extended' : false}));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(express.static( path.join(__dirname,'public') ));

app.use('/', globalController.get404 );

Product.belongsTo(User, { constraints : true, onDelete : 'CASCADE' } );
User.hasMany(Product);

sequelize
	// .sync({force : true})
	.sync()
	.then( result => {
		// console.log(result);
		return User.findByPk(1);
	})
	.then( user => {
		if(!user)
		{
			console.log("Creating new User");
			return User.create({ name:'Test User', email : 'test@test.com' });
		}
		console.log("Dummy user already exists");
		return user;
	})
	.then( user => {
		// console.log(user);
		console.log("Starting server....");
		app.listen(3000);
	})
	.catch( err => {
		console.log(err);
	});
