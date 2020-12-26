const express= require('express');
const AuthController= require('../controllers/authController')
const NGOController= require('../controllers/NGOController')



const Router= express.Router();


// login and signup
Router.post('/signup', AuthController.signupUser)
Router.post('/login', AuthController.loginUser)


// get me
Router.get('/me',AuthController.protectUser, NGOController.getMe, NGOController.getUser)

// update me
Router.patch('/updateMe', AuthController.protectUser, NGOController.updateMe)

// delete me
Router.delete('/deleteMe', AuthController.protectUser, NGOController.deleteMe)



// protection middleware for admin(since it runs in sequence.. it will protect all router below it)
Router.use(AuthController.protectAdmin);

// get all user route
Router
.route('/')
.get(AuthController.restrictTo('SUDO'), NGOController.getAllNGO)

Router
.route('/:id')
.get(AuthController.restrictTo('SUDO'), NGOController.getNGO)
.patch(AuthController.restrictTo('SUDO'), NGOController.updateNGO)
.delete(AuthController.restrictTo('SUDO'), NGOController.deleteNGO)





module.exports= Router;