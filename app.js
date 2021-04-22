// Library imports
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose  = require("mongoose");
const session = require('express-session');
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

// Routes and controllers and models imports
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');
const globalController = require('./controllers/globalPages');
const User = require('./models/user');

// App initialization
const app = express();
const MONGODB_URI = "mongodb+srv://pratik:pratik@cluster0.cflq7.gcp.mongodb.net/shop?retryWrites=true&w=majority";
const store = new MongoStore({
	uri : MONGODB_URI,
	collection : "sessions",
});
const csrfProtection = csrf();

// Setting engines
app.set( "view engine" , "ejs");
app.set( "views" , "views" );

// Middlewares
app.use(bodyParser.urlencoded({ 'extended' : false}));
app.use(express.static( path.join(__dirname,'public') ));
app.use(session({
	secret : "pratik's secret",
	resave : false,
	saveUninitialized : false,
	store : store,
}));
app.use((req, res, next)=> {
	if(!req.session.user){
		return next();
	}
	User
		.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			return next();
		})
		.catch(err => {
			console.log(err);
		})
});
app.use(csrfProtection);
app.use((req, res, next)=> {
	res.locals.isLoggedIn = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// Adding Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/', globalController.get404 );

// Connect to database and start app
mongoose.connect(MONGODB_URI, {
			useNewUrlParser : true,
			useUnifiedTopology : true,
		})
		.then( res => {
			console.log("Starting server");
			app.listen(3000);
		})
		.catch(err => {
			console.log(err);			
		});