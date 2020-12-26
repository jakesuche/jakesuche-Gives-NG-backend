const express= require('express');
const AuthController= require('../controllers/authController')
const AdminController= require('../controllers/adminController')



const Router= express.Router();



//login
Router.post('/login', AuthController.loginAdmin)

// protection middlewares for admin(since it runs in sequence.. it will protect all router below it)
Router.use(AuthController.protectAdmin);
Router.use(AuthController.restrictTo('SUDO'));

//signup
Router.post('/signup', AuthController.signupAdmin)

// get me
Router.get('/me', AdminController.getMe, AdminController.getAdmin)

// update me
Router.patch('/updateMe', AdminController.updateAdmin)

// delete me
Router.delete('/deleteMe', AdminController.deleteAdmin)

Router
.route('/')
.get(AdminController.getAllAdmins);




module.exports= Router
