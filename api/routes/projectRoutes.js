const express= require('express');
const AuthController= require('../controllers/authController')
const NGOController= require('../controllers/NGOController')
const ProjectController= require('../controllers/projectController')


const router= express.Router({mergeParams: true});


// create a project
router.post('/createProject', ProjectController.createProject)

// get project
router.get('/allProjects', ProjectController.findProjects)


// find, update and delete project
router
.route('/:id')
.get(ProjectController.findAProject)
.patch(ProjectController.updateProject)
.delete(ProjectController.deleteProject)







module.exports= router;