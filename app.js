const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require("path");

const app = express();

app.set( "view engine" , "ejs");
app.set( "views" , "views" );

app.use(bodyParser.urlencoded({ 'extended' : false}));
app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(express.static( path.join(__dirname,'public') ));

app.use('/', (req, res, next)=>{
	res.status(404).render('404', {pageTitle : "404 : Page Not Found",
				       path : '404',
	                               });
});
app.listen(3000);
