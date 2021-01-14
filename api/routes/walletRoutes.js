const express= require('express');
const WalletController= require('../controllers/walletcontroller')
const UserController= require('../controllers/userController')
const AuthController= require('../controllers/authController')
const Middleware= require('../middleware/middleware')



const router= express.Router({mergeParams: true});



router
.route('/mywallet')
.get(Middleware.protectUser, Middleware.restrictTo('user'), WalletController.getMyWallet)


// initialize payment by user
router
.post('/initPayment', Middleware.protectUser, Middleware.restrictTo('user'), WalletController.FundUserWallet)


// verify payment by user (this will be added to the callback url in the paystack dashboard)
// router.get('/verifyPayment', Middleware.protectUser, UserController.verifyUserFundingWallet);
router
.get('/verifyPayment', WalletController.verifyUserFundingWallet);

// user's wallet
// router.get('/me/wallet', UserController.userWallet);





// ADMIN

//get all wallet
router
.route('/')
.get(Middleware.protectUser, Middleware.restrictTo('SUDO'), WalletController.getAllWallet)
// .get(WalletController.getAllWallet)


//get single wallet
router
.route('/:id')
.get(Middleware.protectUser, Middleware.restrictTo('SUDO'), WalletController.getWallet)




module.exports= router
