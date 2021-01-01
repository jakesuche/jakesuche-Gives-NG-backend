const express= require('express');
const AuthController= require('../controllers/authController')
const NGOController= require('../controllers/NGOController')



const router= express.Router();


// login and signup
router.post('/signup', AuthController.signupNGO)
router.post('/login', AuthController.loginNGO)


// get me
router.get('/me', AuthController.protectNGO, NGOController.getMe, NGOController.getUser)

// update password
router.patch('/updatePassword', AuthController.forgotPasswordNGO)

// update me
router.patch('/updateMe', AuthController.protectNGO, NGOController.updateMe)

// delete me
router.delete('/deleteMe', AuthController.protectNGO, NGOController.deleteMe)



// protection middleware for admin(since it runs in sequence.. it will protect all router below it)
router.use(AuthController.protectAdmin);

// get all user route
router
.route('/')
.get(AuthController.restrictTo('SUDO'), NGOController.getAllNGO)

router
.route('/:id')
.get(AuthController.restrictTo('SUDO'), NGOController.getNGO)
.patch(AuthController.restrictTo('SUDO'), NGOController.updateNGO)
.delete(AuthController.restrictTo('SUDO'), NGOController.deleteNGO)





module.exports= router;