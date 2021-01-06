const express= require('express');
const AuthController= require('../controllers/authController')
const UserController= require('../controllers/userController')
const projectRoutes= require('../routes/projectRoutes')



const router= express.Router();


// login and signup
router.post('/signup', AuthController.signupUser)
router.post('/login', AuthController.loginUser)

// get me
router.get('/me', AuthController.protectUser, UserController.getMe, UserController.getUser)

// update password
router.patch('/updatePassword', AuthController.forgotPasswordUser)

// update me
router.patch('/updateMe', AuthController.protectUser, UserController.updateMe)

// delete me
router.delete('/deleteMe', AuthController.protectUser, UserController.deleteMe)

// initialize payment by user
router.post('/initPayment', AuthController.protectUser, UserController.FundUserWallet)

// verify payment by user (this will be added to the callback url in the paystack dashboard)
router.get('/verifyPayment', AuthController.protectUser, UserController.verifyUserFundingWallet);






// admin
// get all user route
router
.route('/')
.get(AuthController.protectAdmin, AuthController.restrictTo('SUDO'), UserController.getAllUsers)

router
.route('/:id')
.get(AuthController.protectAdmin, AuthController.restrictTo('SUDO'), UserController.getUser)
.patch(AuthController.protectAdmin, AuthController.restrictTo('SUDO'), UserController.updateUser)
.delete(AuthController.protectAdmin, AuthController.restrictTo('SUDO'), UserController.deleteUser)






//middleware for users and project(NESTED ROUTE)
router.use('/me/createProject', projectRoutes)


module.exports= router;