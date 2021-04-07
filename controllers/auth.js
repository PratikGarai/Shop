exports.getLogin  = (req, res, next) => {
    res.render('auth/login', {
        path : '/login',
        pageTitle : 'Login',
        isLoggedIn : req.isLoggedIn,
    });
}

exports.postLogin  = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
}