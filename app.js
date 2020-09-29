const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
// const shopRoutes = require('./routes/shop.js');
const path = require("path");
const globalController = require('./controllers/globalPages');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set( "view engine" , "ejs");
app.set( "views" , "views" );

app.use(bodyParser.urlencoded({ 'extended' : false}));
app.use(express.static( path.join(__dirname,'public') ));

// app.use((req, res, next)=>{
// 	User
// 		.findByPk(1)
// 		.then( user=> {
// 			req.user = user;
// 			console.log("Binded user to request");
// 			next();
// 		})
// 		.catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use('/', globalController.get404 );

mongoConnect( () => {
	console.log("Starting Server");
	app.listen(3000);
});
