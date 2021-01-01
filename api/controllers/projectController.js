const { promisify }= require('util')
const jwt= require('jsonwebtoken');
const Project = require('../models/projectModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")
const {initializePayment, verifyPayment} = require('../utils/paystack')(request);






exports.createProject= catchAsync(async(req, res, next)=>{
    const {project, amount, description, image }= req.body

    if(!project || !amount || !description ){
        return next(new AppError(`incomplete fields.. please insert the values`, 401))
    }

    const newProject= await Project.create({
        project,
        amount,
        image
    })

    res.status(201).json({
        status:'success',
        data:{
            project: newProject
        }
    })

})

exports.findProjects= catchAsync(async(req, res, next)=>{
    const projects= await Project.find();

    res.status(200).json({
        status:'success',
        data:{
            projects
        }
    })

})

exports.findAProject= catchAsync(async(req, res, next)=>{
    const project= await Project.findById(req.params.id);

    if(!project){
        return next(new AppError(`cannot find this project`, 404));
    }

    res.status(200).json({
        status: 'success',
        data:{
            project
        }
    })

})

exports.updateProject= TemplateAPIMethods.updateOne(Project)

exports.deleteProject= TemplateAPIMethods.deleteOne(Project)

exports.donateToAProjectByUser= catchAsync(async(req, res, next)=>{

})

exports.donateToProjectAnonymous= catchAsync(async(req, res, next)=>{

})