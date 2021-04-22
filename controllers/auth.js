const User = require('../models/user');
const bcrypt = require("bcryptjs");

exports.getLogin  = (req, res, next) => {
    res.render('auth/login', {
        path : '/login',
        pageTitle : 'Login',
    });
}

exports.postLogin  = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User
		.findOne({
                email:email
        })
		.then( user=> {
            if(!user) {
                return res.redirect('/login');
            }
            const match = bcrypt.compareSync(password, user.password);
            if(match)
            {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save(err=> {
                    if(err)
                        console.log("Error saving session : ", err);
                    return res.redirect('/');  
                })
            } else {
                console.log("Passwords don't match");
                return res.redirect('/login');
            }
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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User
        .findOne({email : email})
        .then(userDoc => {
            if(userDoc){
                return res.redirect('/signup');
            }
            const hash  = bcrypt.hashSync(password, 12);
            const user = new User({
                email,
                password : hash, 
                cart : { items : [] }
            });
            user
                .save()
                .then(result => {
                    return res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};