const express= require('express');
const AuthController= require('../controllers/authController')
const UserController= require('../controllers/userController')



const router= express.Router();


// login and signup
router.post('/signup', AuthController.signupUser)
router.post('/login', AuthController.loginUser)


// get me
router.get('/me',AuthController.protectUser, UserController.getMe, UserController.getUser)

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






// protection middleware for admin(since it runs in sequence.. it will protect all router below it)
router.use(AuthController.protectAdmin);

// get all user route
router
.route('/')
.get(AuthController.restrictTo('SUDO'), UserController.getAllUsers)

router
.route('/:id')
.get(AuthController.restrictTo('SUDO'), UserController.getUser)
.patch(AuthController.restrictTo('SUDO'), UserController.updateUser)
.delete(AuthController.restrictTo('SUDO'), UserController.deleteUser)





module.exports= router;