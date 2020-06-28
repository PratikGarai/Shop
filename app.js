const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ 'extended' : false}));

app.get('/add-product', (req, res, next)=> {
	res.send('<html><head><title>Form</title></head><body><form method = "POST" action = "/product" ><input type = "text" name = "sometext"><input type="submit"></form></body></html>');
});

app.post('/product', (req, res, next)=> {
	console.log(req.body);
	res.redirect('/');
});

app.use('/', (req, res, next)=> {
	res.send("<h1>Welcome to HomePage!</h1>");
});

app.listen(3000);
