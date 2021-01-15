const express= require('express');
const AuthController= require('../controllers/authController')
const ProjectController= require('../controllers/projectController')
const Middleware= require('../middleware/middleware')


const router= express.Router({mergeParams: true});


//create and get project
router
.route('/')
.get(ProjectController.findProjects)
.post( Middleware.protectUser, Middleware.restrictTo('user'), ProjectController.createProject)

// accepted By NGO
router.patch('/:id/acceptProject', Middleware.protectUser, Middleware.restrictTo('NGO'), ProjectController.acceptProject)


//approve project by ADMIN
router.patch('/:id/approve', Middleware.protectUser, Middleware.restrictTo('SUDO'), ProjectController.approveProject)

//donate to project
router.post('/:id/donate/initialize', Middleware.protectUser, Middleware.restrictTo('user'), ProjectController.Initializedonation)
router.get('/:id/donate/verify', Middleware.protectUser, Middleware.restrictTo('user'), ProjectController.verifyDonation)


// find, update and delete project
router
.route('/:id')
.get(ProjectController.findAProject)
.patch(ProjectController.updateProject)
.delete(ProjectController.deleteProject)











module.exports= router;