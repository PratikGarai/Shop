exports.get404 = (req, res, next)=>{
	res.status(404).render('404', {
		pageTitle : "404 : Page Not Found",
		path : '404',
		isLoggedIn : req.session.isLoggedIn,
	});
}

exports.get500 = (req, res, next)=>{
	res.status(500).render('500', {
		pageTitle : "500 : Server error!",
		path : '500',
		isLoggedIn : req.session.isLoggedIn,
	});
}