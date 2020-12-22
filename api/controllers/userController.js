const { promisify }= require('util')
const jwt= require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError');




exports.getAllUsers= catchAsync(async(req,res, next)=>{
    const users= await User.find().select('-role')

    res.status(200).json({
        status:'success',
        data:{
            users
        }
    })
})







