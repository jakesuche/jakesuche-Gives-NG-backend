const express= require('express');
const AuthController= require('../controllers/authController')



const Router= express.Router();

// login and signup
Router.post('/signup', AuthController.protectAdmin, AuthController.restrictTo('SUDO'), AuthController.signupAdmin)
Router.post('/login', AuthController.loginAdmin)





module.exports= Router
