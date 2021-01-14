const express= require('express');
const AuthController= require('../controllers/authController')
const UserController= require('../controllers/userController')
const ProjectController= require('../controllers/projectController')
const Middleware= require('../middleware/middleware')
const projectRoutes= require('../routes/projectRoutes')
const walletRoutes= require('../routes/walletRoutes')




const router= express.Router();



// login and signup
router.post('/signup', AuthController.signupUser)
router.post('/login', AuthController.loginUser)

// get me
router.get('/me', Middleware.protectUser, UserController.getMe, UserController.getUser)

// update password
router.patch('/updatePassword', AuthController.forgotPasswordUser)

// update me
router.patch('/updateMe', Middleware.protectUser, UserController.updateMe)

// delete me
router.delete('/deleteMe', Middleware.protectUser, UserController.deleteMe)



// for NGO USERS
router.patch('/:id/acceptProject', UserController.acceptProjectByNGOUser)



// for Admin users
router
.route('/')
// .get(Middleware.protectUser, Middleware.restrictTo('SUDO'), UserController.getAllUsers)
.get(UserController.getAllUsers)


router
.route('/:id')
.get(Middleware.protectUser, Middleware.restrictTo('SUDO'), UserController.getUser)
.patch(Middleware.protectUser, Middleware.restrictTo('SUDO'), UserController.updateUser)
.delete(Middleware.protectUser, Middleware.restrictTo('SUDO'), UserController.deleteUser)






//NESTED ROUTE(FOR USER AND PROJECT)
router.use('/me/projects', projectRoutes)

//NESTED ROUTE(FOR USER AND PROJECT)
router.use('/me/wallets', walletRoutes)



module.exports= router;