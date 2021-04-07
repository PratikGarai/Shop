// Library imports
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose  = require("mongoose");
const session = require('express-session');
const MongoStore = require("connect-mongodb-session")(session);

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
})

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
}))

app.use((req, res, next)=>{

	// The simple cookie example
	const cookie_strings = req.get('Cookie').split(';');
    const cookies = {};
    cookie_strings.map(element => {
        let [key, value] = element.trim().split('=');
        cookies[key] = value;
    })
    console.log("Cookies : \n", cookies);
	req.isLoggedIn = cookies.loggedIn==='true';

	User
		.findById('5fc21c8d01c44b545c817bc0')
		.then( user=> {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err)
		});
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