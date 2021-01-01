const express= require('express');
const AuthController= require('../controllers/authController')
const AdminController= require('../controllers/adminController')



const router= express.Router();



//login
router.post('/login', AuthController.loginAdmin)

// protection middlewares for admin(since it runs in sequence.. it will protect all router below it)
router.use(AuthController.protectAdmin);
router.use(AuthController.restrictTo('SUDO'));

//signup
router.post('/signup', AuthController.signupAdmin)

// get me
router.get('/me', AdminController.getMe, AdminController.getAdmin)

// update password
router.patch('/updatePassword', AuthController.forgotPasswordAdmin)

// update me
router.patch('/updateMe', AdminController.updateAdmin)

// delete me
router.delete('/deleteMe', AdminController.deleteAdmin)

router
.route('/')
.get(AdminController.getAllAdmins);




module.exports= router
