const { promisify }= require('util')
const jwt= require('jsonwebtoken');
const NGO = require('../models/NGOModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")




// to filter object for update user
const filterObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach((el)=>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj;
}


//USER ROUTES

exports.getMe= (req, res, next)=>{
    // authenticate the route
    if(!req.user) return next(new AppError(`you need to be authenticated in order to view this!`, 401));
    req.params.id= req.user.id;
    next()
}

exports.getUser= catchAsync(async(req,res, next)=>{
    const ngo= await NGO.findById(req.user.id).select('-role')

    res.status(200).json({
        status:'success',
        data:{
            ngo
        }
    })
})

exports.updateMe= catchAsync(async(req,res, next)=>{
    const filteredBody= filterObj(req.body, 'name', 'email')

    const ngo= await NGO.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            ngo
        }
    })
})

exports.deleteMe= catchAsync(async(req,res, next)=>{
    const ngo= await NGO.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status:'success',
        data:{
            ngo
        }
    })
})




//ADMIN USER PREMISSION ROUTES
exports.getAllNGO= TemplateAPIMethods.getAll(NGO);

exports.getNGO= TemplateAPIMethods.getOne(NGO);

// DO NOT CHANGE THE USER'S PASSWORD(ADMIN)
exports.updateNGO= TemplateAPIMethods.updateOne(NGO)

exports.deleteNGO= TemplateAPIMethods.deleteOne(NGO);

