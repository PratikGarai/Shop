const User = require('../models/user');

exports.getLogin  = (req, res, next) => {
    res.render('auth/login', {
        path : '/login',
        pageTitle : 'Login',
        isLoggedIn : req.session.isLoggedIn,
    });
}

exports.postLogin  = (req, res, next) => {
    User
		.findById('5fc21c8d01c44b545c817bc0')
		.then( user=> {
			req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
		})
		.catch(err => {
			console.log(err)
		});
}

exports.postLogout  = (req, res, next) => {
    req.session.destroy(err=> {
        if(err)
            console.log(err);
        res.redirect('/');
    })
}