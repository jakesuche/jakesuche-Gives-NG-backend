const { promisify }= require('util')
const User = require('../models/userModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods")
const Project= require('../models/projectModel')
const Wallet= require('../models/WalletModel')



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
    // const user= await User.findById(req.user.id).select('-role')
    const user= await User.findById(req.user.id);

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

exports.updateMe= catchAsync(async(req,res, next)=>{
    const filteredBody= filterObj(req.body, 'name', 'email')

    const user= await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

exports.deleteMe= catchAsync(async(req,res, next)=>{

    await Wallet.findByIdAndDelete(req.user.id)
    const user= await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status:'success',
        data:{
            user
        }
    })
})







 // USER(SPECIFICALLY NGO CAN ACCEPT PROJECTS)
 exports.acceptProjectByNGOUser= catchAsync(async(req, res, next)=>{
     const project= await Project.findByIdAndUpdate(req.params.id, {projectAcceptedBy: req.user._id},{
         new: true
     })

     res.status(200).json({
         status:'success',
         data:{
             project
         }
     })
 })




//ADMIN USER PREMISSION ROUTES
exports.getAllUsers= TemplateAPIMethods.getAll(User);

exports.getUser= TemplateAPIMethods.getOne(User);

// DO NOT CHANGE THE USER'S PASSWORD(ADMIN)
exports.updateUser= TemplateAPIMethods.updateOne(User)

exports.deleteUser= TemplateAPIMethods.deleteOne(User);



