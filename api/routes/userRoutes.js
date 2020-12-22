const express= require('express');
const AuthController= require('../controllers/authController')
const UserController= require('../controllers/userController')



const Router= express.Router();

// protect middleware
// AuthController.protectUser

// restrict middleware
// AuthController.restrictTo(process.env.USER, process.env.NGO, process.env.ADMIN)

// login and signup
Router.post('/signup', AuthController.signupUser)
Router.post('/login', AuthController.loginUser)



// get all user route
Router
.route('/')
.get(AuthController.protectAdmin, AuthController.restrictTo('SUDO'), UserController.getAllUsers)





module.exports= Router;