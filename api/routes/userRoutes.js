const express= require('express');
const AuthController= require('../controllers/authController')
const UserController= require('../controllers/userController')



const Router= express.Router();


// login and signup
Router.post('/signup', AuthController.signupUser)
Router.post('/login', AuthController.loginUser)


// get me
Router.get('/me',AuthController.protectUser, UserController.getMe, UserController.getUser)

// update me
Router.patch('/updateMe', AuthController.protectUser, UserController.updateMe)

// delete me
Router.delete('/deleteMe', AuthController.protectUser, UserController.deleteMe)



// protection middleware for admin(since it runs in sequence.. it will protect all router below it)
Router.use(AuthController.protectAdmin);

// get all user route
Router
.route('/')
.get(AuthController.restrictTo('SUDO'), UserController.getAllUsers)

Router
.route('/:id')
.get(AuthController.restrictTo('SUDO'), UserController.getUser)
.patch(AuthController.restrictTo('SUDO'), UserController.updateUser)
.delete(AuthController.restrictTo('SUDO'), UserController.deleteUser)





module.exports= Router;