const express = require("express");

const router = express.Router();

router.get('/add-product', (req, res, next)=> {
	res.send('<html><head><title>Form</title></head><body><form method = "POST" action = "/product" ><input type = "text" name = "sometext"><input type="submit"></form></body></html>');
});

router.post('/product', (req, res, next)=> {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
