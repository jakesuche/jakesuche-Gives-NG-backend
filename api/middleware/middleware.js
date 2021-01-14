const {promisify}= require('util')
const jwt= require('jsonwebtoken');
const User= require('../models/userModel')
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError')



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

    //check if the user change password
    // if(currentUser.changedPasswordAfter(decodedToken.iat)){
    //     return next(new AppError(`user just currently changed password... try again`, 401))
    // }

    req.user = currentUser;

    next(); 
})


exports.restrictTo= (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            console.log(roles, req.user.role);
            return next(new AppError(`You are unauthorized to access this route.`, 401))
        }
        next();
        
    }
}

