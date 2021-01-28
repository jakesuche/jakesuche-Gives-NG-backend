const catchAsync= require('../utils/catchAsync');
const AppError= require('../utils/AppError');
const TemplateAPIMethods= require('./TemplateAPIMethods');
const User = require('../models/userModel');
const Wallet= require('../models/WalletModel');
const Email= require("../utils/email")



// COOKIE OPTIONS FOR RESPONSE
// const cookieOptions= {
//     expires: Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60 * 60 * 1000,
//     httpOnly: true
// }


// USER AUTHENTICATION ROUTES

exports.signupUser= catchAsync(async(req, res, next)=>{
    const {
        name, 
        email, 
        password,
        NGOName,
        phoneNumber,
        address,
        LGA,
        CACNumber,
        NGODescription
    }= req.body;

    // declaring new user
    let newUser;

    // check if there is a header
    if(!req.headers.role){
        req.headers.role= 'user'
        // return next(new AppError(`you are highly unauthorized to signup`, 401))
    }

    if(req.headers.role==='user'){
        if(!name || !email || !password){
            return next(new AppError(`you have to provide these details`, 400))
        }

        newUser= await User.create({
            name,
            email,
            password,
        })

    }else if(req.headers.role==='NGO'){
        if(!name || !email || !password || !NGOName || !phoneNumber || !address || !LGA || !CACNumber || !NGODescription){
            return next(new AppError(`you have to provide these details`, 404))
        }

        newUser= await User.create({
            name,
            email,
            password,
            organization:{
                NGOName,
                phoneNumber,
                address,
                LGA,
                CACNumber,
                NGODescription
            },
            role: req.headers.role
        })

    }else if(req.headers.role==='SUDO'){

        newUser= await User.create({
            name,
            email,
            password,
            role: req.headers.role
        })
    }
    
    
    // create wallet for new user
    await Wallet.create({
        user: newUser._id,
        balance: 0
    })

    //create token
    const token= newUser.signinToken(newUser._id);

    // remove password from response
    newUser.password= undefined;
    newUser._v= undefined;


    // send welcome signup email
    //generate url
    const url= '';
    await new Email(newUser, url).sendWelcome()

    //creating a cookie to send to client
    // if(process.env.NODE_ENV ==='production') cookieOptions.secure= true;
    // res.cookie('jwt', token, cookieOptions)

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

    if(!user || !(await user.comparePassword(password, user.password))){
        return next(new AppError(`User not found`, 401))
    }

    const token= user.signinToken(user._id);


    //creating a cookie to send to client
    // if(process.env.NODE_ENV ==='production') cookieOptions.secure= true;
    // res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status:'success',
        token
    })
})

exports.forgotPasswordUser= TemplateAPIMethods.forgotPasswordTemplate(User, 'users');

exports.resetPassword= TemplateAPIMethods.resetPasswordTemplate(User)
