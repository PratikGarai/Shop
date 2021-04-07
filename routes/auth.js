const express = require("express");
const path = require("path");
const authController = require('../controllers/auth.js');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;