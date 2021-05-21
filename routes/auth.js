const express = require("express");
const authController = require('../controllers/auth.js');
const {check, body} = require("express-validator/check");
const User = require("../models/user");
const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
                [
                    check("email")
                        .isEmail()
                        .withMessage("Please enter a valid email")
                        .custom((value, {req})=> {
                            return User.findOne({email : value}).then(userDoc => {
                                if(userDoc)
                                    return Promise.reject('Email already in use')
                            })
                        }),
                    body("password", "Password should be atleast 6 characters long")
                        .isLength({min : 6}), 
                    body('confirmPassword')
                        .custom((value, {req}) => {
                            if(value!==req.body.password) {
                                throw new Error('Passswords don\'t match');
                            }
                            return true
                        })
                ],
                authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;