const { promisify }= require('util');
const jwt= require('jsonwebtoken');
const User = require('../models/userModel');
const Admin= require('../models/adminModel');
const catchAsync= require('../utils/catchAsync');
const AppError= require('../utils/AppError');


// COOKIE OPTIONS FOR RESPONSE
const cookieOptions= {
    expires: Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60 * 60 * 1000,
    httpOnly: true
}

//PROTECT AND RESTRICT MIDDLEWARES FOR USER

exports.protectUser= catchAsync(async(req, res, next)=>{

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token= req.headers.authorization.split(' ')[1] 
    }

    if(!token){
        return next(new AppError(`You are unauthorized.`, 401))
    }

    const decodedToken= await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decodedToken);
    

    const currentUser= await User.findById(decodedToken.id);
    
    if(!currentUser){
        return next(new AppError(`User bearing this token does not exist.`, 401))
    }


    req.user = currentUser;

    next(); 
})




// USER AUTHENTICATION ROUTES

exports.signupUser= catchAsync(async(req, res, next)=>{

    const {name, email, password}= req.body;

    const newUser= await User.create({
        name,
        email,
        password
    })

    const token= newUser.signinToken(newUser._id);

    // remove password from response
    newUser.password= undefined
    newUser._v= undefined
    newUser.role= undefined

    //creating a cookie to send to client
    if(process.env.NODE_ENV ==='production') cookieOptions.secure= true;
    res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status:'success',
        token,
        data:{
            user: newUser
        }
    }) 
})


exports.loginUser= catchAsync(async(req, res, next)=>{
    const {email, password}= req.body;

    const user= await User.findOne({email}).select('+password');

    if(!email || !password){
        return next(new AppError(`email and password not present.`, 401))
    }

    if(!user || !user.comparePassword(password, user.password)){
        return next(new AppError(`User not found`, 404))
    }

    const token= user.signinToken(user._id)

    //creating a cookie to send to client
    if(process.env.NODE_ENV ==='production') cookieOptions.secure= true;
    res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status:'success',
        token
    })
})


//NGO AUTHENTICATION ROUTES




// ADMIN AUTHENTICATION ROUTES

//PROTECT AND RESTRICT MIDDLEWARES FOR ADMIN 

exports.protectAdmin= catchAsync(async(req, res, next)=>{

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token= req.headers.authorization.split(' ')[1] 
    }

    if(!token){
        return next(new AppError(`You are unauthorized.`, 401))
    }

    const decodedToken= await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decodedToken);
    

    const currentAdmin= await Admin.findById(decodedToken.id);
    
    if(!currentAdmin){
        return next(new AppError(`Admin bearing this token does not exist.`, 401))
    }

    req.admin = currentAdmin;

    next(); 
})


exports.restrictTo= (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.admin.role)){
            console.log(roles, req.admin.role);
            return next(new AppError(`You are unauthorized to access this route.`, 401))
        }
        next();
        
    }
}


exports.signupAdmin= catchAsync(async(req, res, next)=>{
    const {name, email, password}= req.body;

    const newAdmin= await Admin.create({
        name,
        email,
        password,
        role: process.env.ADMIN
    })

    const token= newAdmin.signinToken(newAdmin._id)

    //remove password from response
    newAdmin.password= undefined;
    newAdmin._v= undefined;
    newAdmin.role= undefined;

    //creating a cookie to send to client
    if(process.env.NODE_ENV ==='production') cookieOptions.secure= true;
    res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status:'success',
        token,
        data:{
            user: newAdmin
        }
    }) 
})


exports.loginAdmin= catchAsync(async(req,res, next)=>{
    const {email, password}= req.body;

    const admin= await Admin.findOne({email}).select('+password');

    if(!email || !password){
        return next(new AppError(`email and password not present.`, 401))
    }

    if(!admin || !admin.comparePassword(password, admin.password)){
        return next(new AppError(`Admin not found.`, 404))
    }

    const token= admin.signinToken(admin._id)

    //creating a cookie to send to client
    if(process.env.NODE_ENV ==='production') cookieOptions.secure= true;
    res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status:'success',
        token
    })
})


