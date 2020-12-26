const Admin = require('../models/adminModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require("./TemplateAPIMethods");



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
    if(!req.admin) return next(new AppError(`you need to be authenticated as an admin in order to view this!`, 401));
    req.params.id= req.admin.id;
    next()
}

exports.getAdmin= catchAsync(async(req,res, next)=>{
    const admin= await Admin.findById(req.admin.id).select('-role')

    res.status(200).json({
        status:'success',
        data:{
            admin
        }
    })
})

exports.updateAdmin= catchAsync(async(req,res, next)=>{
    const filteredBody= filterObj(req.body, 'name', 'email', 'status')

    const admin= await Admin.findByIdAndUpdate(req.admin.id, filteredBody, {
        new: true,
        runValidators: true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            admin
        }
    })
})

exports.deleteAdmin= catchAsync(async(req,res, next)=>{
    const admin= await Admin.findByIdAndUpdate(req.admin.id, {status: 'suspend'});

    res.status(204).json({
        status:'success',
        data:{
            admin
        }
    })
})


//ADMIN USER PREMISSION ROUTES
exports.getAllAdmins= TemplateAPIMethods.getAll(Admin);