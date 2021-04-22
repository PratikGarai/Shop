const User = require('../models/user');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const secrets = require("../secrets");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
        api_key : secrets.SENDGRID_API_KEY
    }
}))

exports.getLogin  = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0)
        message = message[0];
    else 
        message = null;
    res.render('auth/login', {
        path : '/login',
        pageTitle : 'Login',
        errorMessage : message
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
                req.flash('error', 'Invalid credentials.');
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
                req.flash('error', 'Invalid credentials');
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
    let message = req.flash('error');
    if(message.length>0)
        message = message[0];
    else 
        message = null;
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage : message
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
                req.flash('error', 'Email already in use.');
                return res.redirect('/signup');
            }
            else if(password !== confirmPassword) {
                req.flash('error', 'Passwords don\'t match.');
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
                    res.redirect('/login');
                    return transporter.sendMail({
                        to : email, 
                        from : "pulugarai0208@gmail.com", 
                        subject : "SignUp successful", 
                        html : "<h1>Welcome To Shop Clone</h1>"
                    });
                })
                .catch(err => {
                    console.log("Error sending email : ", err);
                })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0)
        message = message[0];
    else 
        message = null;
    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage : message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32 , (err, buf)=> {
        if(err) {
            console.log("Error generating random value");
            req.flash('error', 'Error in token generation');
            return res.redirect('/reset');
        }
        const token = buf.toString('hex');
        User
            .findOne({email : req.body.email})
            .then(user => {
                if(!user){
                    req.flash('error', 'User does not exist');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to : req.body.email, 
                    from : "pulugarai0208@gmail.com", 
                    subject : "Password Reset Token", 
                    html : `
                    <p> You requested a password reset. Click this link reset you password (valid for the next hour)<br>
                    <a href="${secrets.URL}/reset/${token}">Click Here!</a>
                    </p>
                    `
                });
            })
            .catch(err => {
                console.log("Error fetching user : ", err);
                return res.redirect("/reset");
            })
    });
}