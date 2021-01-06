const crypto= require('crypto')
const catchAsync = require("../utils/catchAsync");
const ApiFeatures= require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const sendEmail= require("../utils/email")



exports.getAll= Model => catchAsync(async(req, res, next)=>{
    console.log(req.requestTime);

    // FOR WANTING TO FILTER REVIEWS BASED ON SOME PARAMETERS(FROM NESTED ROUTES)
    let filter={}
    // if(req.params.tourId) filter= {tour: req.params.tourId}


    //API Features
    const features= new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()


    // fetch the Tours from the db using the models. 
    const docs= await features.Model;
    
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        Result: docs.length,
        data:{
            docs
        }
    })
})

exports.getOne= (Model, populateOptions) => catchAsync(async(req, res, next)=>{
    // this selectively adds the populate object and its options
    let query= Model.findById(req.params.id);
    if(populateOptions) query= query.populate(populateOptions);

    // fetching a single tour from db
    const doc= await query;

    if(!doc){
        return next(new AppError(`no document found with this ID`, 404))
    }

    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
})

exports.deleteOne= Model => catchAsync(async(req, res, next)=>{
    const doc= await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError(`no document found with this ID`, 404))
    }

    res.status(204).json({
        status:'success',
        data: null
    })
})

exports.updateOne= Model=> catchAsync(async(req, res, next)=>{
    const doc= await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    if(!doc){
        return next(new AppError(`no document found with this ID`, 404))
        }

    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
})


exports.createOne= Model => catchAsync(async(req, res, next)=>{
    // creating a tour using another way 
    const doc= await Model.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            doc
        }
    })
})


exports.forgotPasswordTemplate= (Model, typeofUser) => catchAsync(async(req, res, next)=>{
    //1- get the user based on the posted email
    const user= await Model.findOne({email: req.body.email});

    //2- check if user does exist or not
    if(!user){
        return next(new AppError(`There is no user with this email address`), 404)
    }

    //3- if user exists, generate the password reset token
    const resetToken = user.createPasswordResetToken();

    //4- then save the user(in order to save the encrypted password reset token generated in the userschema)
    await user.save({validateBeforeSave: false})

    //5- send the email
    const resetUrl= `${req.protocol}://${req.get('host')}/api/v1/${typeofUser}/resetPassword/${resetToken}`

    const message= `Forgot your password? submit a patch request with your password and password confirm to ${resetUrl}
    .\n If you did not forget your password, please ignore this email`

    try{
        sendEmail({
            email: user.email,
            subject: `Your Password reset(Valid For 10mins)`,
            message
        })

        res.status(200).json({
            status:'success',
            message:'the password reset token has been sent to your email'
        })
    }catch(err){
        user.passwordResetToken= undefined;
        user.passwordResetExpires= undefined;
        await user.save({validateBeforeSave: false})

        return next(new AppError(`There was an error sending the mail.. Try Again`), 400)
    }
})

exports.resetPasswordTemplate= (Model)=> catchAsync(async(req, res, next)=>{
    // generate our hashed token from the token sent through the url
    const hashedToken= crypto.createHash('sha256').update(req.params.token).digest('hex');

    // get user based on the hashed token and password reset token expiry date
    const user= await Model.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})

    if(!user){
        return next(new AppError(`Token is invalid or has expired`, 400))
    }

    // add the password to the user and reset the other values
    user.password= req.body.password;
    user.passwordResetToken= undefined;
    user.passwordResetExpires= undefined;

    // save the details to the user
    await user.save()
})