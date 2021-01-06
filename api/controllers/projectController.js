const { promisify }= require('util')
const jwt= require('jsonwebtoken');
const Project = require('../models/projectModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")





const filterObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach((el)=>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj;
}


exports.createProject= catchAsync(async(req, res, next)=>{
    const {project, amount, description, image }= req.body

    if(!project || !amount || !description ){
        return next(new AppError(`incomplete fields.. please insert the values`, 401))
    }

    const newProject= await Project.create({
        project,
        amount,
        description,
        image,
        projectCreatedBy:''
    })

    res.status(201).json({
        status:'success',
        data:{
            project: newProject
        }
    })

})

exports.findProjects= TemplateAPIMethods.getAll(Project)


exports.findAProject= TemplateAPIMethods.getOne(Project)

exports.updateProject= TemplateAPIMethods.updateOne(Project)

exports.deleteProject= TemplateAPIMethods.deleteOne(Project)


exports.donateToProjectAnonymous= catchAsync(async(req, res, next)=>{

})









//Admin Privileges

exports.approveProject= catchAsync(async(req, res, next)=>{

    // check to see if project is already approved
    let doc= await Project.findOne({ _id: req.params.id }, {approved: true});

    if(doc){
        return next(new AppError(`this project has already been approved`, 401));
    }

    doc = await Project.findByIdAndUpdate(req.params.id, {approved: true}, {
        new: true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
})
