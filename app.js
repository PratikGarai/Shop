const http = require('http');
const express = require('express');

const app = express();

app.use('/add-product', (req, res, next)=> {
	res.send("<h1>This is add-product page.</h1>");
});

app.use('/', (req, res, next)=> {
	res.send("<h1>Welcome to HomePage!</h1>");
});

app.listen(3000);
